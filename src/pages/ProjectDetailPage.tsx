import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, GitBranch, Ticket, Hash, Star, Activity,
  GitMerge, AlertCircle, MessageSquare, RefreshCw, Sparkles
} from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { Badge, GlassCard } from '../components/ui';

const mockPRs = [
  { id: 'pr1', title: 'Switch to polling-based webhook fallback', number: 847, status: 'merged', author: 'alexc', date: 'Feb 15' },
  { id: 'pr2', title: 'Add circuit breaker for downstream services', number: 891, status: 'merged', author: 'sarahk', date: 'Mar 2' },
  { id: 'pr3', title: 'Implement retry queue with exponential backoff', number: 903, status: 'open', author: 'marcusw', date: 'Mar 18' },
  { id: 'pr4', title: 'Update Kubernetes health check intervals', number: 921, status: 'closed', author: 'alexc', date: 'Apr 5' },
];

const mockJiraIssues = [
  { id: 'j1', key: 'BACKEND-1123', title: 'Investigate webhook delivery failures', status: 'Done', priority: 'High', date: 'Feb 10' },
  { id: 'j2', key: 'BACKEND-1156', title: 'Scale polling service for peak load', status: 'In Progress', priority: 'Medium', date: 'Mar 1' },
  { id: 'j3', key: 'BACKEND-1198', title: 'Add distributed tracing to order flow', status: 'Todo', priority: 'Low', date: 'Apr 12' },
];

const mockSlack = [
  { id: 's1', channel: '#backend-infra', text: 'After the third incident this week with webhooks, switching to polling...', user: 'Alex C.', date: 'Feb 8' },
  { id: 's2', channel: '#engineering', text: 'order-service deploy complete. New polling interval: 30s', user: 'Sarah K.', date: 'Feb 16' },
  { id: 's3', channel: '#incidents', text: 'P2 resolved: High CPU on order-service was due to tight polling loop', user: 'Marcus W.', date: 'Mar 5' },
];

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'prs' | 'jira' | 'slack'>('overview');

  const project = mockProjects.find(p => p.id === id) || mockProjects[0];

  const statusVariant = (s: string): 'green' | 'orange' | 'red' => {
    if (s === 'healthy' || s === 'merged' || s === 'Done') return 'green';
    if (s === 'warning' || s === 'open' || s === 'In Progress') return 'orange';
    return 'red';
  };

  const tabs = ['overview', 'prs', 'jira', 'slack'] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 border border-accent-blue/20 flex items-center justify-center">
            <span className="text-2xl font-black text-accent-blue">{project.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-black font-mono">{project.name}</h1>
            <p className="text-text-secondary text-sm mt-1">{project.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={statusVariant(project.status)} dot>{project.status}</Badge>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Star size={10} /> {project.stars} stars
              </span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Activity size={10} /> {project.lastActivity}
              </span>
            </div>
          </div>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
          <RefreshCw size={13} /> Sync
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: GitBranch, label: 'Pull Requests', value: project.prCount, color: '#4F8CFF' },
          { icon: Ticket, label: 'Jira Issues', value: project.jiraCount, color: '#8B5CF6' },
          { icon: Hash, label: 'Slack Threads', value: project.slackActivity, color: '#22C55E' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${stat.color}20` }}>
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-xl font-black">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      <GlassCard className="bg-gradient-to-br from-accent-blue/5 to-accent-purple/5" hover={false}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-accent-blue" />
          <span className="font-semibold text-sm">AI-Generated Project Summary</span>
          <Badge variant="blue" size="sm">Updated 2h ago</Badge>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">{project.name}</strong> is a{' '}
          {project.language} service handling core order processing flows. The service underwent a significant
          architecture change in Q1 2024, switching from webhook-based to polling-based event ingestion
          (<span className="text-accent-blue font-mono text-xs">PR #847</span>) after reliability issues in Kubernetes.
          Key architectural patterns include circuit breakers, retry queues with exponential backoff, and distributed
          tracing. Recent activity focuses on scaling for peak load
          (<span className="text-accent-purple font-mono text-xs">BACKEND-1156</span>).
        </p>
      </GlassCard>

      {/* Tabs */}
      <div className="border-b border-white/5">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-accent-blue border-accent-blue'
                  : 'text-text-muted border-transparent hover:text-text-secondary'
              }`}
            >
              {tab === 'prs' ? 'Pull Requests' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4">Architecture Summary</h3>
              <div className="space-y-2 text-xs text-text-secondary">
                {['Polling-based event ingestion (30s interval)', 'Circuit breaker pattern (threshold: 50%)', 'Retry queue with exponential backoff', 'Distributed tracing via OpenTelemetry', 'Kubernetes HPA (min: 2, max: 10 pods)'].map(item => (
                  <div key={item} className="flex items-center gap-2 p-2 bg-bg-elevated rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4">Deployment History</h3>
              <div className="space-y-2">
                {[
                  { version: 'v2.4.1', date: 'Mar 18', status: 'success' },
                  { version: 'v2.4.0', date: 'Mar 2', status: 'success' },
                  { version: 'v2.3.9', date: 'Feb 20', status: 'rollback' },
                  { version: 'v2.3.8', date: 'Feb 15', status: 'success' },
                ].map(dep => (
                  <div key={dep.version} className="flex items-center gap-3 text-xs p-2 bg-bg-elevated rounded-lg">
                    <div className={`w-1.5 h-1.5 rounded-full ${dep.status === 'success' ? 'bg-accent-green' : 'bg-red-400'}`} />
                    <span className="font-mono text-text-primary">{dep.version}</span>
                    <span className="text-text-muted ml-auto">{dep.date}</span>
                    <Badge variant={dep.status === 'success' ? 'green' : 'red'} size="sm">{dep.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prs' && (
          <div className="space-y-2">
            {mockPRs.map(pr => (
              <div key={pr.id} className="card p-4 flex items-center gap-4">
                <GitMerge size={15} className={pr.status === 'merged' ? 'text-accent-purple' : pr.status === 'open' ? 'text-accent-green' : 'text-text-muted'} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{pr.title}</div>
                  <div className="text-xs text-text-muted mt-0.5">#{pr.number} · {pr.author} · {pr.date}</div>
                </div>
                <Badge variant={statusVariant(pr.status)}>{pr.status}</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'jira' && (
          <div className="space-y-2">
            {mockJiraIssues.map(issue => (
              <div key={issue.id} className="card p-4 flex items-center gap-4">
                <AlertCircle size={15} className="text-accent-blue" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{issue.title}</div>
                  <div className="text-xs text-text-muted mt-0.5">{issue.key} · {issue.priority} priority · {issue.date}</div>
                </div>
                <Badge variant={statusVariant(issue.status)}>{issue.status}</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'slack' && (
          <div className="space-y-2">
            {mockSlack.map(thread => (
              <div key={thread.id} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={12} className="text-accent-purple" />
                  <span className="text-xs font-mono text-accent-purple">{thread.channel}</span>
                  <span className="text-xs text-text-muted ml-auto">{thread.user} · {thread.date}</span>
                </div>
                <p className="text-sm text-text-secondary">{thread.text}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectDetailPage;
