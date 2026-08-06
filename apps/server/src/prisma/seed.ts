import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.testResult.deleteMany();
  await prisma.testRun.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.testSuite.deleteMany();
  await prisma.prd.deleteMany();
  await prisma.agentSession.deleteMany();
  await prisma.userInteraction.deleteMany();
  await prisma.agentMessage.deleteMany();

  // Create admin user (password: admin123)
  const bcrypt = (await import('bcryptjs')).default;
  const passwordHash = await bcrypt.hash('admin123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@testcolony.io' },
    update: {},
    create: {
      email: 'admin@testcolony.io',
      passwordHash,
      displayName: 'Admin',
      role: 'admin',
    },
  });
  console.log('  User:', user.email);

  // Create project
  const project = await prisma.project.upsert({
    where: { slug: 'shop-api' },
    update: {},
    create: {
      name: 'Shop API',
      slug: 'shop-api',
      description: '电商平台后端服务 · API 自动化测试',
      ownerId: user.id,
    },
  });
  console.log('  Project:', project.name);

  // Create PRDs
  const prd = await prisma.prd.create({
    data: {
      projectId: project.id,
      title: 'User Login & Auth Feature',
      version: '1.0',
      content: `# User Login & Authentication

## Functional Requirements

### 1. Login
- User can login with email and password
- Show error message for invalid credentials
- Redirect to dashboard after successful login

### 2. Password Reset
- User can request password reset via email
- Reset link expires after 1 hour
- New password must be at least 8 characters

### 3. Account Lockout
- Account locks after 5 consecutive failed login attempts
- Lockout duration: 30 minutes
- Show lockout message to user

### 4. Token Management
- JWT access token with 15min expiry
- Refresh token with 7-day expiry
- Automatic token refresh on 401 response`,
      status: 'ready',
      createdBy: user.id,
    },
  });
  console.log('  PRD:', prd.title);

  // Create test suites
  const suite1 = await prisma.testSuite.create({
    data: { projectId: project.id, name: 'Auth Tests', description: 'Authentication & login tests', sortOrder: 0 },
  });
  const suite2 = await prisma.testSuite.create({
    data: { projectId: project.id, name: 'API Tests', description: 'REST API endpoint tests', sortOrder: 1 },
  });
  const suite3 = await prisma.testSuite.create({
    data: { projectId: project.id, name: 'E2E Tests', description: 'End-to-end user journey tests', sortOrder: 2, parentId: null },
  });
  console.log('  Test Suites: 3');

  // Create test cases
  const testCases = [
    { title: 'Login with valid credentials', priority: 'P0', category: 'functional' },
    { title: 'Login with invalid password', priority: 'P0', category: 'functional' },
    { title: 'Login with non-existent email', priority: 'P1', category: 'functional' },
    { title: 'Password reset request', priority: 'P1', category: 'functional' },
    { title: 'Password reset with expired link', priority: 'P2', category: 'functional' },
    { title: 'Account lockout after 5 failures', priority: 'P0', category: 'security' },
    { title: 'Account unlock after timeout', priority: 'P1', category: 'security' },
    { title: 'JWT token refresh flow', priority: 'P0', category: 'functional' },
    { title: 'Refresh token rotation', priority: 'P1', category: 'security' },
    { title: 'Logout invalidates all tokens', priority: 'P1', category: 'security' },
    { title: 'GET /api/products returns 200', priority: 'P0', category: 'api' },
    { title: 'POST /api/orders validation', priority: 'P1', category: 'api' },
    { title: 'Complete checkout flow E2E', priority: 'P0', category: 'e2e' },
    { title: 'User registration to first order', priority: 'P1', category: 'e2e' },
  ];

  for (const tc of testCases) {
    await prisma.testCase.create({
      data: {
        testSuiteId: tc.category === 'functional' || tc.category === 'security' ? suite1.id :
                     tc.category === 'api' ? suite2.id : suite3.id,
        prdId: prd.id,
        title: tc.title,
        description: `Test case for: ${tc.title}`,
        testSteps: [{ step: 1, action: `Execute ${tc.title}`, expected: 'Expected behavior as specified' }],
        expectedResult: 'Test passes with expected behavior',
        priority: tc.priority,
        category: tc.category,
        tags: [tc.category, tc.priority.toLowerCase()],
        source: 'ai_generated',
        createdBy: user.id,
      },
    });
  }
  console.log(`  Test Cases: ${testCases.length}`);

  // Create agent definitions from .claude files
  const agentDefs = [
    {
      name: 'test-case-generator',
      description: '基于 PRD 文档生成全面的测试用例（主 Agent A）',
      systemPrompt: '# Test Case Generator Agent\n\nYou are a senior QA engineer.\nGenerate comprehensive test cases from PRD documents.',
      model: 'deepseek-chat',
      temperature: 0.3,
      maxTokens: 8192,
      tools: ['read_file', 'write_file', 'web_search', 'grep'],
    },
    {
      name: 'test-executor',
      description: '基于测试用例执行自动化测试（主 Agent B）',
      systemPrompt: '# Test Executor Agent\n\nYou are a senior test automation engineer.\nExecute tests and produce comprehensive results.',
      model: 'deepseek-chat',
      temperature: 0.2,
      maxTokens: 8192,
      tools: ['read_file', 'write_file', 'bash', 'grep'],
    },
    {
      name: 'prd-analyzer',
      description: '分析 PRD 文档，提取结构化需求和测试建议（子 Agent）',
      systemPrompt: '# PRD Analyzer Agent\n\nYou are a requirements analysis specialist.\nRead PRD documents and extract structured, testable requirements.',
      model: 'deepseek-chat',
      temperature: 0.2,
      maxTokens: 4096,
      tools: ['read_file', 'grep'],
    },
  ];

  for (const ad of agentDefs) {
    await prisma.agentDefinition.upsert({
      where: { projectId_name: { projectId: project.id, name: ad.name } },
      update: ad,
      create: { ...ad, projectId: project.id },
    });
  }
  console.log(`  Agent Definitions: ${agentDefs.length}`);

  // Create skill definitions
  const skillDefs = [
    { name: 'prd-analyzer', description: '分析 PRD 文档，提取功能需求和测试场景', body: '# PRD Analyzer Skill\n\nSystematically analyze PRD documents.', tools: ['read_file', 'grep'], contextMode: 'inline' },
    { name: 'test-case-writer', description: '将分析结果编写为标准格式的测试用例', body: '# Test Case Writer Skill\n\nWrite structured test cases.', tools: ['write_file'], contextMode: 'inline' },
    { name: 'boundary-value-analyzer', description: '边界值分析和等价类划分', body: '# Boundary Value Analyzer\n\nAnalyze boundary values.', tools: [], contextMode: 'inline' },
    { name: 'test-executor', description: '执行自动化测试', body: '# Test Executor Skill\n\nExecute automated tests.', tools: ['read_file', 'bash', 'write_file'], contextMode: 'fork' },
    { name: 'failure-analyzer', description: '分析测试失败原因', body: '# Failure Analyzer Skill\n\nAnalyze test failures.', tools: ['read_file', 'grep'], contextMode: 'inline' },
  ];

  for (const sd of skillDefs) {
    await prisma.skillDefinition.upsert({
      where: { projectId_name: { projectId: project.id, name: sd.name } },
      update: sd,
      create: { ...sd, projectId: project.id },
    });
  }
  console.log(`  Skill Definitions: ${skillDefs.length}`);

  console.log('\nSeed complete! Login: admin@testcolony.io / admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
