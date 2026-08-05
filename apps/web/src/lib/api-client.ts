const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BASE = `${API_URL}/api/v1`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (data: { email: string; password: string }) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: { email: string; password: string; displayName: string }) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/me'),

  // Projects
  getProjects: (page = 1, pageSize = 20) => request(`/projects?page=${page}&pageSize=${pageSize}`),
  getProject: (id: string) => request(`/projects/${id}`),
  createProject: (data: any) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),

  // PRDs
  getPrds: (projectId: string) => request(`/projects/${projectId}/prds`),
  createPrd: (projectId: string, data: any) => request(`/projects/${projectId}/prds`, { method: 'POST', body: JSON.stringify(data) }),

  // Test Cases
  getTestCases: (projectId: string, suiteId: string) => request(`/projects/${projectId}/suites/${suiteId}/cases`),
  generateTestCases: (projectId: string, data: any) => request(`/projects/${projectId}/cases/generate`, { method: 'POST', body: JSON.stringify(data) }),

  // Test Runs
  getRuns: (projectId: string, page = 1) => request(`/projects/${projectId}/runs?page=${page}`),
  startRun: (projectId: string, data: any) => request(`/projects/${projectId}/runs`, { method: 'POST', body: JSON.stringify(data) }),
  cancelRun: (projectId: string, runId: string) => request(`/projects/${projectId}/runs/${runId}/cancel`, { method: 'POST' }),

  // Agents
  getAgents: (projectId: string) => request(`/projects/${projectId}/agents`),
  createAgent: (projectId: string, data: any) => request(`/projects/${projectId}/agents`, { method: 'POST', body: JSON.stringify(data) }),

  // Skills
  getSkills: (projectId: string) => request(`/projects/${projectId}/skills`),
  createSkill: (projectId: string, data: any) => request(`/projects/${projectId}/skills`, { method: 'POST', body: JSON.stringify(data) }),

  // Interactions
  respondToInteraction: (projectId: string, interactionId: string, response: string) =>
    request(`/projects/${projectId}/interactions/${interactionId}/respond`, { method: 'POST', body: JSON.stringify({ response }) }),
  skipInteraction: (projectId: string, interactionId: string) =>
    request(`/projects/${projectId}/interactions/${interactionId}/skip`, { method: 'POST' }),
};
