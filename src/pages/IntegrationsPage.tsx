import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch, Ticket, Hash, BookOpen, RefreshCw, Plus, Trash2,
  CheckCircle, Clock, AlertTriangle, Upload, Key, Settings
} from 'lucide-react';
import { mockIntegrations } from '../data/mockData';
import type { Integration } from '../types';
import { Badge, SyncStatus, GlassCard } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const integrationConfig: Record<string, { icon: React.ElementType; color: string; description: string; features: string[] }> = {
  github: {
    icon: GitBranch, color: '#4F8CFF',
    description: 'Index pull requests, commits, code reviews, and issue discussions.',
    features: ['Pull requests', 'Commit messages', 'Code reviews', 'GitHub discussions'],
  },
  jira: {
    icon: Ticket, color: '#8B5CF6',
    description: 'Index Jira tickets, epics, comments, and project history.',
    features: ['Issues & epics', 'Comments & history', 'Sprint data', 'Linked issues'],
  },
  slack: {
    icon: Hash, color: '#22C55E',
    description: 'Index Slack channels, threads, and engineering discussions.',
    features: ['Public channels', 'Thread replies', 'Pinned messages', 'Bookmarks'],
  },
  runbooks: {
    icon: BookOpen, color: '#F59E0B',
    description: 'Upload and index runbooks, architecture docs, and decision records.',
    features: ['Markdown files', 'PDF documents', 'ADR files', 'Architecture diagrams'],
  },
};

const IntegrationsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncing(id);
    await new Promise(r => setTimeout(r, 2000));
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, lastSync: 'just now', status: 'connected' } : i));
    setSyncing(null);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'disconnected' } : i));
  };

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected' } : i));
  };

  const statusVariantBadge = (s: string): 'green' | 'orange' | 'red' | 'gray' => {
    if (s === 'connected') return 'green';
    if (s === 'syncing') return 'orange';
    if (s === 'error') return 'red';
    return 'gray';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Integrations</h1>
          <p className="text-text-secondary text-sm mt-1">Connect your engineering tools and manage data indexing</p>
        </div>
        {isAdmin && (
          <button className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <Key size={13} /> API Keys
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <AlertTriangle size={16} className="text-orange-400 flex-shrink-0" />
          <span className="text-sm text-orange-300">Integration management is restricted to Team Leaders. Contact your admin to modify integrations.</span>
        </div>
      )}

      {/* Integration Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration, i) => {
          const config = integrationConfig[integration.type];
          const Icon = config.icon;
          const isCurrentlySyncing = syncing === integration.id || integration.status === 'syncing';

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${config.color}15`, border: `1.5px solid ${config.color}30` }}>
                    <Icon size={22} style={{ color: config.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{integration.name}</h3>
                    <SyncStatus status={integration.status} />
                  </div>
                </div>
                <Badge variant={statusVariantBadge(integration.status)}>
                  {integration.status}
                </Badge>
              </div>

              <p className="text-xs text-text-secondary mb-4">{config.description}</p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {config.features.map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                    <CheckCircle size={10} style={{ color: config.color }} className="flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              {/* Metrics */}
              {integration.status === 'connected' || integration.status === 'syncing' ? (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-bg-elevated rounded-lg border border-white/5">
                    <div className="text-sm font-bold">{integration.itemsIndexed.toLocaleString()}</div>
                    <div className="text-[9px] text-text-muted">Indexed</div>
                  </div>
                  <div className="text-center p-2 bg-bg-elevated rounded-lg border border-white/5">
                    <div className="text-sm font-bold">{integration.health}%</div>
                    <div className="text-[9px] text-text-muted">Health</div>
                  </div>
                  <div className="text-center p-2 bg-bg-elevated rounded-lg border border-white/5">
                    <div className="text-[10px] font-medium text-text-secondary">{integration.lastSync}</div>
                    <div className="text-[9px] text-text-muted">Last sync</div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-bg-elevated rounded-xl border border-dashed border-white/10 text-xs text-text-muted text-center">
                  Not connected — no data indexed
                </div>
              )}

              {/* Health Bar */}
              {(integration.status === 'connected' || integration.status === 'syncing') && (
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-text-muted mb-1">
                    <span>Sync Health</span>
                    <span>{integration.health}%</span>
                  </div>
                  <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${integration.health}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: integration.health > 80 ? '#22C55E' : integration.health > 60 ? '#F59E0B' : '#EF4444' }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              {isAdmin && (
                <div className="flex gap-2">
                  {integration.status === 'connected' || integration.status === 'syncing' ? (
                    <>
                      <button
                        onClick={() => handleSync(integration.id)}
                        disabled={!!isCurrentlySyncing}
                        className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
                      >
                        <RefreshCw size={11} className={isCurrentlySyncing ? 'animate-spin' : ''} />
                        {isCurrentlySyncing ? 'Syncing...' : 'Sync Now'}
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 text-red-400 text-xs hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => integration.type === 'runbooks' ? setUploadOpen(true) : handleConnect(integration.id)}
                      className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
                    >
                      {integration.type === 'runbooks' ? <><Upload size={11} /> Upload Files</> : <><Plus size={11} /> Connect</>}
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-text-secondary text-xs hover:bg-white/5 transition-colors">
                    <Settings size={11} />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <h3 className="font-bold text-lg mb-2">Upload Runbooks</h3>
            <p className="text-sm text-text-secondary mb-6">Upload Markdown, PDF, or text files to index as runbooks.</p>
            <div className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center mb-4 hover:border-accent-blue/30 transition-colors cursor-pointer">
              <Upload size={24} className="text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary">Drop files here or click to browse</p>
              <p className="text-xs text-text-muted mt-1">Supports .md, .pdf, .txt — Max 50MB</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setUploadOpen(false)} className="btn-secondary flex-1 py-2">Cancel</button>
              <button onClick={() => setUploadOpen(false)} className="btn-primary flex-1 py-2">Upload & Index</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Indexing Queue */}
      <GlassCard hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} className="text-accent-blue" />
          <h3 className="font-semibold text-sm">Indexing Pipeline Status</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Queued', value: 47, color: '#94A3B8' },
            { label: 'Processing', value: 12, color: '#4F8CFF' },
            { label: 'Completed', value: 14124, color: '#22C55E' },
            { label: 'Failed', value: 3, color: '#EF4444' },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-bg-elevated rounded-xl border border-white/5">
              <div className="text-xl font-black" style={{ color: item.color }}>{item.value.toLocaleString()}</div>
              <div className="text-xs text-text-muted mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default IntegrationsPage;
