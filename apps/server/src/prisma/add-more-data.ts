const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'admin@testcolony.io' } });
  if (!user) { console.log('No user found'); return; }

  // Add PRDs to User Portal
  const portal = await prisma.project.findFirst({ where: { slug: 'user-portal' } });
  if (portal) {
    const prd1 = await prisma.prd.create({ data: {
      projectId: portal.id, title: 'User Registration Flow', version: '1.0', status: 'ready', createdBy: user.id,
      content: '# User Registration\n\n## Requirements\n1. Email verification\n2. Password strength validation\n3. Social login (Google, GitHub)',
    }});
    const prd2 = await prisma.prd.create({ data: {
      projectId: portal.id, title: 'Profile Management', version: '1.0', status: 'draft', createdBy: user.id,
      content: '# Profile Management\n\n## Requirements\n1. Avatar upload\n2. Bio editing\n3. Privacy settings',
    }});
    const s1 = await prisma.testSuite.create({ data: { projectId: portal.id, name: 'Registration Tests', sortOrder: 0 } });
    for (const t of ['Email verification sent', 'Weak password rejected', 'Google OAuth success', 'GitHub OAuth success', 'Duplicate email handled']) {
      await prisma.testCase.create({ data: { testSuiteId: s1.id, title: t, priority: 'P1', testSteps: [{step:1,action:t,expected:'Works'}], source: 'ai_generated', createdBy: user.id } });
    }
    console.log('User Portal: 2 PRDs, 1 suite, 5 cases');
  }

  // Add PRDs to Payment Service
  const payment = await prisma.project.findFirst({ where: { slug: 'payment-svc' } });
  if (payment) {
    const prd1 = await prisma.prd.create({ data: {
      projectId: payment.id, title: 'Payment Processing API', version: '1.0', status: 'ready', createdBy: user.id,
      content: '# Payment Processing\n\n## Requirements\n1. Credit card processing\n2. Refund handling\n3. Webhook notifications',
    }});
    const s1 = await prisma.testSuite.create({ data: { projectId: payment.id, name: 'Payment API Tests', sortOrder: 0 } });
    for (const t of ['Charge card success', 'Invalid card declined', 'Refund processed', 'Webhook received', 'Idempotency key check']) {
      await prisma.testCase.create({ data: { testSuiteId: s1.id, title: t, priority: 'P0', testSteps: [{step:1,action:t,expected:'Works'}], source: 'ai_generated', createdBy: user.id } });
    }
    console.log('Payment Service: 1 PRD, 1 suite, 5 cases');
  }

  // Add some test runs
  const shopApi = await prisma.project.findFirst({ where: { slug: 'shop-api' } });
  if (shopApi) {
    for (let i = 0; i < 5; i++) {
      const status = i < 3 ? 'completed' : i === 3 ? 'running' : 'failed';
      await prisma.testRun.create({ data: {
        projectId: shopApi.id, triggerType: 'ai_agent', status,
        startedAt: new Date(Date.now() - (i+1)*3600000),
        completedAt: status === 'completed' ? new Date(Date.now() - i*3600000) : null,
        totalCases: 14, passedCases: status === 'completed' ? 12 + i : 8,
        failedCases: status === 'completed' ? 2 - i : 4, errorCases: 0,
        name: `Regression #${42 - i}`,
      }});
    }
    console.log('Shop API: 5 test runs added');
  }
  console.log('\nDone! 3 projects with full data');
}
main().catch(console.error).finally(() => prisma.$disconnect());
