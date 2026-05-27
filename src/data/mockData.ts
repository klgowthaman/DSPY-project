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
  { id: 'ws1', name: 'Backend Engineering', description: 'Core backend services and APIs', memberCount: 12, projectCount: 5, createdAt: '2024-01-15' },
  { id: 'ws2', name: 'Platform Team', description: 'Infrastructure and DevOps', memberCount: 8, projectCount: 3, createdAt: '2024-02-20' },
  { id: 'ws3', name: 'Frontend Guild', description: 'UI components and web apps', memberCount: 15, projectCount: 7, createdAt: '2024-03-10' },
];

// ============================================
// MOCK PROJECTS
// ============================================
export const mockProjects: Project[] = [
  {
    id: 'p1', name: 'order-service', description: 'Core order processing microservice handling all purchase flows',
    language: 'Go', stars: 47, lastActivity: '2 hours ago', status: 'healthy', prCount: 8, jiraCount: 23, slackActivity: 156,
  },
  {
    id: 'p2', name: 'payment-service', description: 'Payment processing with retry queues and circuit breakers',
    language: 'Python', stars: 32, lastActivity: '4 hours ago', status: 'warning', prCount: 3, jiraCount: 12, slackActivity: 89,
  },
  {
    id: 'p3', name: 'auth-gateway', description: 'JWT-based authentication and authorization service',
    language: 'TypeScript', stars: 61, lastActivity: '1 day ago', status: 'healthy', prCount: 5, jiraCount: 18, slackActivity: 234,
  },
  {
    id: 'p4', name: 'notification-hub', description: 'Multi-channel notification dispatch system',
    language: 'Python', stars: 28, lastActivity: '3 days ago', status: 'critical', prCount: 1, jiraCount: 7, slackActivity: 45,
  },
  {
    id: 'p5', name: 'data-pipeline', description: 'ETL pipeline for analytics and ML feature store',
    language: 'Python', stars: 19, lastActivity: '6 hours ago', status: 'healthy', prCount: 12, jiraCount: 31, slackActivity: 312,
  },
];

// ============================================
// MOCK INTEGRATIONS
// ============================================
export const mockIntegrations: Integration[] = [
  { id: 'i1', type: 'github', name: 'GitHub', status: 'connected', lastSync: '5 min ago', itemsIndexed: 1847, health: 99 },
  { id: 'i2', type: 'jira', name: 'Jira', status: 'connected', lastSync: '12 min ago', itemsIndexed: 3241, health: 97 },
  { id: 'i3', type: 'slack', name: 'Slack', status: 'syncing', lastSync: '2 min ago', itemsIndexed: 8912, health: 85 },
  { id: 'i4', type: 'runbooks', name: 'Runbooks', status: 'connected', lastSync: '1 hour ago', itemsIndexed: 124, health: 100 },
];

// ============================================
// MOCK TEAM MEMBERS
// ============================================
export const mockTeamMembers: TeamMember[] = [
  { id: 't1', name: 'Alex Chen', email: 'alex.chen@company.com', role: 'admin', avatar: 'AC', joinedAt: '2024-01-15', lastActive: '2 min ago', queriesCount: 421 },
  { id: 't2', name: 'Sarah Kim', email: 'sarah.kim@company.com', role: 'engineer', avatar: 'SK', joinedAt: '2024-02-10', lastActive: '1 hour ago', queriesCount: 287 },
  { id: 't3', name: 'Marcus Webb', email: 'marcus.webb@company.com', role: 'viewer', avatar: 'MW', joinedAt: '2024-03-05', lastActive: '3 hours ago', queriesCount: 89 },
  { id: 't4', name: 'Priya Patel', email: 'priya.patel@company.com', role: 'engineer', avatar: 'PP', joinedAt: '2024-03-20', lastActive: '30 min ago', queriesCount: 156 },
  { id: 't5', name: 'James Liu', email: 'james.liu@company.com', role: 'engineer', avatar: 'JL', joinedAt: '2024-04-01', lastActive: '5 hours ago', queriesCount: 312 },
];

// ============================================
// MOCK NOTIFICATIONS
// ============================================
export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'warning', title: 'Slack Sync Delayed', message: 'Slack integration is behind by 15 minutes due to rate limiting.', timestamp: '5 min ago', read: false },
  { id: 'n2', type: 'success', title: 'GitHub Sync Complete', message: '1,847 items indexed successfully from order-service.', timestamp: '12 min ago', read: false },
  { id: 'n3', type: 'info', title: 'New Team Member', message: 'Priya Patel joined the Backend Engineering workspace.', timestamp: '2 hours ago', read: true },
  { id: 'n4', type: 'error', title: 'Jira Token Expiring', message: 'Your Jira API token expires in 7 days. Please renew it.', timestamp: '1 day ago', read: true },
];

// ============================================
// MOCK ANALYTICS DATA
// ============================================
export const mockAnalytics: AnalyticsData[] = [
  { date: 'May 21', queries: 42, confidence: 87, users: 8 },
  { date: 'May 22', queries: 61, confidence: 89, users: 10 },
  { date: 'May 23', queries: 38, confidence: 85, users: 7 },
  { date: 'May 24', queries: 78, confidence: 91, users: 12 },
  { date: 'May 25', queries: 95, confidence: 93, users: 14 },
  { date: 'May 26', queries: 112, confidence: 90, users: 11 },
  { date: 'May 27', queries: 87, confidence: 92, users: 13 },
];

export const mockTopQuestions = [
  { question: 'Why does order-service use polling instead of webhooks?', count: 34, trend: 'up' },
  { question: 'Why is payment-service using retry queues?', count: 28, trend: 'up' },
  { question: 'Why was auth-gateway migrated from Node.js to TypeScript?', count: 21, trend: 'stable' },
  { question: 'What caused the data-pipeline migration to Spark?', count: 18, trend: 'down' },
  { question: 'Why does notification-hub use SNS instead of SQS?', count: 15, trend: 'up' },
];

export const mockKnowledgeGaps = [
  { area: 'Deployment Process', score: 23, severity: 'critical' },
  { area: 'Database Schema Changes', score: 41, severity: 'warning' },
  { area: 'Error Handling Patterns', score: 58, severity: 'medium' },
  { area: 'API Rate Limiting', score: 67, severity: 'low' },
  { area: 'Auth Flow Documentation', score: 72, severity: 'low' },
];

// ============================================
// MOCK CITATIONS
// ============================================
export const mockCitations: Citation[] = [
  {
    id: 'c1',
    type: 'github',
    title: 'PR #847: Switch to polling-based webhook fallback',
    url: '#',
    excerpt: 'Due to reliability issues with GitHub webhooks in our Kubernetes environment, we implemented polling as primary mechanism with webhook as enhancement...',
    date: '2024-02-15',
    relevance: 0.94,
  },
  {
    id: 'c2',
    type: 'jira',
    title: 'BACKEND-1123: Investigate webhook delivery failures',
    url: '#',
    excerpt: 'Webhook delivery rate dropped to 73% during peak traffic. Root cause: firewall rules blocking inbound webhook calls from GitHub IP ranges...',
    date: '2024-02-10',
    relevance: 0.89,
  },
  {
    id: 'c3',
    type: 'slack',
    title: '#backend-infra: Discussion on webhook vs polling',
    url: '#',
    excerpt: 'Alex: After the third incident this week with webhooks, I think we need to bite the bullet and switch to polling. The reliability is just not there...',
    date: '2024-02-08',
    relevance: 0.82,
  },
  {
    id: 'c4',
    type: 'runbook',
    title: 'Order Service Architecture Decisions',
    url: '#',
    excerpt: 'Section 3.2: Event Ingestion Strategy. The team evaluated webhooks, polling, and event streaming. Polling was chosen for its predictability and observability...',
    date: '2024-02-20',
    relevance: 0.78,
  },
];

export const mockSuggestedQuestions = [
  'Why does order-service use polling instead of webhooks?',
  'Why is payment-service using retry queues?',
  'What caused the auth-gateway migration from Node.js?',
  'How does the data-pipeline handle schema changes?',
  'Why was SNS chosen over SQS for notifications?',
  'What is the deployment strategy for order-service?',
];

export const mockSparklineData = [4, 7, 5, 11, 8, 13, 10, 16, 12, 18, 14, 21];

export const mockMetrics = [
  { id: 'm1', label: 'Total Projects', value: '5', change: 2, changeType: 'positive' as const, color: '#4F8CFF', sparkline: [2, 3, 3, 4, 4, 5, 5] },
  { id: 'm2', label: 'Repositories', value: '23', change: 3, changeType: 'positive' as const, color: '#8B5CF6', sparkline: [15, 17, 18, 20, 21, 22, 23] },
  { id: 'm3', label: 'Jira Tickets', value: '3,241', change: 124, changeType: 'positive' as const, color: '#06B6D4', sparkline: [2800, 2950, 3050, 3100, 3150, 3200, 3241] },
  { id: 'm4', label: 'Slack Threads', value: '8,912', change: 312, changeType: 'positive' as const, color: '#22C55E', sparkline: [7200, 7800, 8100, 8400, 8600, 8800, 8912] },
  { id: 'm5', label: 'AI Queries Today', value: '87', change: -8, changeType: 'negative' as const, color: '#F59E0B', sparkline: [95, 110, 78, 120, 95, 87, 87] },
  { id: 'm6', label: 'Knowledge Score', value: '91%', change: 3, changeType: 'positive' as const, color: '#10B981', sparkline: [85, 86, 87, 88, 89, 90, 91] },
];
