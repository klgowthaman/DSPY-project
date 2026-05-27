// ============================================
// CORE TYPES
// ============================================

export type UserRole = 'admin' | 'engineer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  projectCount: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  lastActivity: string;
  status: 'healthy' | 'warning' | 'critical';
  prCount: number;
  jiraCount: number;
  slackActivity: number;
}

export interface Integration {
  id: string;
  type: 'github' | 'jira' | 'slack' | 'runbooks';
  name: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  itemsIndexed: number;
  health: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  confidence?: number;
  reasoning?: string[];
  isTyping?: boolean;
}

export interface Citation {
  id: string;
  type: 'github' | 'jira' | 'slack' | 'runbook';
  title: string;
  url: string;
  excerpt: string;
  date: string;
  relevance: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
  sparkline: number[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedAt: string;
  lastActive: string;
  queriesCount: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AnalyticsData {
  date: string;
  queries: number;
  confidence: number;
  users: number;
}

export interface KnowledgeNode {
  id: string;
  type: 'service' | 'pr' | 'ticket' | 'slack' | 'decision' | 'runbook';
  label: string;
  description?: string;
  connections: number;
}
