import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, GitBranch, Ticket, Hash, MessageSquare, BarChart3,
  TrendingUp, TrendingDown, Activity, RefreshCw, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { mockMetrics, mockProjects, mockIntegrations, mockAnalytics } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Badge, SyncStatus } from '../components/ui';

const iconMap: Record<string, React.ElementType> = {
  'm1': FolderOpen, 'm2': GitBranch, 'm3': Ticket, 'm4': Hash, 'm5': MessageSquare, 'm6': BarChart3,
};

const Dashboard: React.FC = () => {
  const { user, workspace } = useAuth();
  const navigate = useNavigate();

  const statusVariant = (s: string): 'green' | 'orange' | 'red' => {
    if (s === 'healthy' || s === 'connected') return 'green';
    if (s === 'warning' || s === 'syncing') return 'orange';
    return 'red';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary">
            Good afternoon, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {workspace?.name} · {workspace?.memberCount} members · {workspace?.projectCount} projects
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
          <RefreshCw size={13} /> Sync All
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMetrics.map((metric, i) => {
          const Icon = iconMap[metric.id] || Activity;
          const sparkData = metric.sparkline.map((v) => ({ v }));
          const isPositive = metric.changeType === 'positive';

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="card p-5 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-text-secondary font-medium">{metric.label}</p>
                  <p className="text-2xl font-black text-text-primary mt-1">{metric.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${metric.color}20`, border: `1px solid ${metric.color}30` }}
                >
                  <Icon size={18} style={{ color: metric.color }} />
                </div>
              </div>

              <div className="h-10 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <Line
                      type="monotone" dataKey="v" stroke={metric.color}
                      strokeWidth={1.5} dot={false}
                    />
                    <Tooltip
                      contentStyle={{ display: 'none' }}
                      cursor={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-accent-green' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                <span>{isPositive ? '+' : ''}{metric.change} this week</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Activity Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-base">AI Query Activity</h2>
              <p className="text-text-secondary text-xs mt-0.5">Last 7 days</p>
            </div>
            <Badge variant="blue" dot>Live</Badge>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalytics}>
                <Line type="monotone" dataKey="queries" stroke="#4F8CFF" strokeWidth={2} dot={false} name="Queries" />
                <Line type="monotone" dataKey="confidence" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Confidence" />
                <Tooltip
                  contentStyle={{ background: '#1a2236', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <div className="w-3 h-0.5 bg-accent-blue rounded" /> AI Queries
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <div className="w-3 h-0.5 bg-accent-purple rounded" /> Avg. Confidence
            </div>
          </div>
        </div>

        {/* Integration Health */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base">Integrations</h2>
            <button onClick={() => navigate('/integrations')} className="text-xs text-accent-blue hover:underline">Manage</button>
          </div>
          <div className="space-y-3">
            {mockIntegrations.map(int => (
              <div key={int.id} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <span className="text-sm">
                    {int.type === 'github' ? '⬡' : int.type === 'jira' ? '◆' : int.type === 'slack' ? '#' : '▶'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-text-primary">{int.name}</div>
                  <div className="text-[10px] text-text-muted">{int.itemsIndexed.toLocaleString()} items</div>
                </div>
                <SyncStatus status={int.status} showLabel={false} />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-accent-green/5 rounded-xl border border-accent-green/10 text-xs text-accent-green">
            3 of 4 integrations healthy
          </div>
        </div>
      </div>

      {/* Projects + Quick AI */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base">Recent Projects</h2>
            <button onClick={() => navigate('/projects')} className="text-xs text-accent-blue hover:underline flex items-center gap-1">
              All <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {mockProjects.slice(0, 4).map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-elevated cursor-pointer transition-colors border border-transparent hover:border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-blue">{project.name[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold font-mono text-text-primary">{project.name}</div>
                  <div className="text-[11px] text-text-muted">{project.lastActivity}</div>
                </div>
                <Badge variant={statusVariant(project.status)} dot size="sm">
                  {project.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick AI Query */}
        <GlassCard className="bg-gradient-to-br from-accent-blue/5 to-accent-purple/5" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <MessageSquare size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm">Quick AI Query</span>
            <Badge variant="blue" size="sm">DSPy</Badge>
          </div>
          <p className="text-xs text-text-secondary mb-4">Ask anything about your engineering history</p>

          <div className="space-y-2 mb-4">
            {[
              'Why does order-service use polling?',
              'What caused the auth-gateway migration?',
              'Why are retry queues used in payment-service?',
            ].map(q => (
              <button
                key={q}
                onClick={() => navigate('/ai')}
                className="w-full text-left text-xs p-3 rounded-xl bg-bg-elevated border border-white/5 hover:border-accent-blue/20 hover:bg-accent-blue/5 transition-all text-text-secondary hover:text-text-primary"
              >
                {q}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/ai')}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm"
          >
            Open AI Assistant <ArrowRight size={13} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
