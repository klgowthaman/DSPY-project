import type { User, Workspace, Project, Integration, TeamMember, Notification, AnalyticsData, Citation } from '../types';

// ============================================
// MOCK USERS
// ============================================
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    avatar: 'AC',
    role: 'admin',
    workspaceId: 'ws1',
  },
  {
    id: 'u2',
    name: 'Sarah Kim',
    email: 'sarah.kim@company.com',
    avatar: 'SK',
    role: 'engineer',
    workspaceId: 'ws1',
  },
  {
    id: 'u3',
    name: 'Marcus Webb',
    email: 'marcus.webb@company.com',
    avatar: 'MW',
    role: 'viewer',
    workspaceId: 'ws1',
  },
];

// ============================================
// MOCK WORKSPACES
// ============================================
export const mockWorkspaces: Workspace[] = [
  { id: 'ws1', name: 'Backend Engineering', description: 'Core backend services and APIs', memberCount: 1, projectCount: 0, createdAt: '2024-01-15' },
];

// ============================================
// MOCK PROJECTS
// ============================================
export const mockProjects: Project[] = [];

// ============================================
// MOCK INTEGRATIONS
// ============================================
export const mockIntegrations: Integration[] = [
  { id: 'i1', type: 'github', name: 'GitHub', status: 'disconnected', lastSync: 'never', itemsIndexed: 0, health: 100 },
  { id: 'i2', type: 'jira', name: 'Jira', status: 'disconnected', lastSync: 'never', itemsIndexed: 0, health: 100 },
  { id: 'i3', type: 'slack', name: 'Slack', status: 'disconnected', lastSync: 'never', itemsIndexed: 0, health: 100 },
  { id: 'i4', type: 'runbooks', name: 'Runbooks', status: 'disconnected', lastSync: 'never', itemsIndexed: 0, health: 100 },
];

// ============================================
// MOCK TEAM MEMBERS
// ============================================
export const mockTeamMembers: TeamMember[] = [
  { id: 't1', name: 'Alex Chen', email: 'alex.chen@company.com', role: 'admin', avatar: 'AC', joinedAt: '2024-01-15', lastActive: 'just now', queriesCount: 0 },
];

// ============================================
// MOCK NOTIFICATIONS
// ============================================
export const mockNotifications: Notification[] = [];

// ============================================
// MOCK ANALYTICS DATA
// ============================================
export const mockAnalytics: AnalyticsData[] = [];

export const mockTopQuestions: { question: string; count: number; trend: string }[] = [];

export const mockKnowledgeGaps: { area: string; score: number; severity: string }[] = [];

// ============================================
// MOCK CITATIONS
// ============================================
export const mockCitations: Citation[] = [];

export const mockSuggestedQuestions: string[] = [];

export const mockSparklineData: number[] = [];

export const mockMetrics = [
  { id: 'm1', label: 'Total Projects', value: '0', change: 0, changeType: 'positive' as const, color: '#4F8CFF', sparkline: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'm2', label: 'Repositories', value: '0', change: 0, changeType: 'positive' as const, color: '#8B5CF6', sparkline: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'm3', label: 'Jira Tickets', value: '0', change: 0, changeType: 'positive' as const, color: '#06B6D4', sparkline: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'm4', label: 'Slack Threads', value: '0', change: 0, changeType: 'positive' as const, color: '#22C55E', sparkline: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'm5', label: 'AI Queries Today', value: '0', change: 0, changeType: 'positive' as const, color: '#F59E0B', sparkline: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'm6', label: 'Knowledge Score', value: '0%', change: 0, changeType: 'positive' as const, color: '#10B981', sparkline: [0, 0, 0, 0, 0, 0, 0] },
];
