import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Trash2, Shield, Mail, Settings as SettingsIcon,
  Bell, Lock, Globe, ChevronRight, Check, AlertTriangle
} from 'lucide-react';
import { mockTeamMembers } from '../data/mockData';
import type { TeamMember } from '../types';
import { Avatar, Badge, GlassCard } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'engineer' | 'viewer'>('engineer');
  const [activeSection, setActiveSection] = useState<'team' | 'workspace' | 'notifications' | 'security'>('team');
  const [saved, setSaved] = useState(false);

  const roleVariant = (r: string): 'blue' | 'purple' | 'gray' => {
    if (r === 'admin') return 'blue';
    if (r === 'engineer') return 'purple';
    return 'gray';
  };

  const handleRemove = (id: string) => {
    if (id === user?.id) return;
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    const initials = inviteEmail.split('@')[0].slice(0, 2).toUpperCase();
    const newMember: TeamMember = {
      id: `t${Date.now()}`, name: inviteEmail.split('@')[0], email: inviteEmail,
      role: inviteRole, avatar: initials, joinedAt: new Date().toISOString().split('T')[0],
      lastActive: 'Invited', queriesCount: 0,
    };
    setMembers(prev => [...prev, newMember]);
    setInviteEmail('');
    setInviteOpen(false);
  };

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'workspace', label: 'Workspace', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ] as const;

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0">
        <div className="card p-2 space-y-0.5">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeSection === s.id ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`}
            >
              <s.icon size={14} />
              {s.label}
              <ChevronRight size={12} className="ml-auto opacity-50" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>

            {/* Team Section */}
            {activeSection === 'team' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black">Team Members</h1>
                    <p className="text-text-secondary text-sm mt-1">{members.length} members in this workspace</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setInviteOpen(true)}
                      className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
                    >
                      <UserPlus size={13} /> Invite Member
                    </button>
                  )}
                </div>

                {!isAdmin && (
                  <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <AlertTriangle size={16} className="text-orange-400 flex-shrink-0" />
                    <span className="text-sm text-orange-300">Team management is restricted to Team Leaders.</span>
                  </div>
                )}

                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Member', 'Role', 'Last Active', 'Queries', ''].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs text-text-muted font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map(member => (
                        <tr key={member.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar initials={member.avatar} size="sm" />
                              <div>
                                <div className="text-xs font-semibold text-text-primary">{member.name}</div>
                                <div className="text-[11px] text-text-muted">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={roleVariant(member.role)} size="sm" dot>
                              {member.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-xs text-text-muted">{member.lastActive}</td>
                          <td className="py-3 px-4 text-xs font-semibold">{member.queriesCount}</td>
                          <td className="py-3 px-4">
                            {isAdmin && member.id !== user?.id && (
                              <button
                                onClick={() => handleRemove(member.id)}
                                className="text-text-muted hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Roles Reference */}
                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={14} className="text-accent-blue" />
                    <h3 className="font-semibold text-sm">Role Permissions</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { role: 'Team Leader', perms: ['All access', 'Manage integrations', 'Invite/remove users', 'API keys', 'Analytics'], color: '#4F8CFF' },
                      { role: 'Engineer', perms: ['AI Assistant', 'View projects', 'Search knowledge', 'View citations', 'Basic analytics'], color: '#8B5CF6' },
                      { role: 'Viewer', perms: ['AI Assistant', 'View projects', 'Search knowledge', 'View citations'], color: '#94A3B8' },
                    ].map(r => (
                      <div key={r.role} className="p-4 bg-bg-elevated rounded-xl border border-white/5">
                        <div className="font-semibold text-xs mb-3" style={{ color: r.color }}>{r.role}</div>
                        <ul className="space-y-1.5">
                          {r.perms.map(p => (
                            <li key={p} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                              <Check size={9} style={{ color: r.color }} /> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Workspace Section */}
            {activeSection === 'workspace' && (
              <div className="space-y-4">
                <h1 className="text-xl font-black">Workspace Settings</h1>
                <div className="card p-6 space-y-6">
                  {[
                    { label: 'Workspace Name', value: 'Backend Engineering', type: 'text' },
                    { label: 'Description', value: 'Core backend services and APIs', type: 'text' },
                    { label: 'Domain', value: 'company.com', type: 'text' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="text-xs text-text-secondary mb-1.5 block font-medium">{field.label}</label>
                      <input
                        defaultValue={field.value}
                        type={field.type}
                        className="w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue/40 transition-all"
                      />
                    </div>
                  ))}
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm py-2 px-6">
                    {saved ? <><Check size={13} /> Saved!</> : <><SettingsIcon size={13} /> Save Changes</>}
                  </button>
                </div>

                <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <h3 className="font-semibold text-sm text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-xs text-text-secondary mb-3">Deleting a workspace is permanent and cannot be undone.</p>
                  <button className="text-xs px-4 py-2 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                    Delete Workspace
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <h1 className="text-xl font-black">Notifications</h1>
                <div className="card p-6 space-y-4">
                  {[
                    { label: 'Integration failures', desc: 'Get notified when a connection breaks', enabled: true },
                    { label: 'Token expiry warnings', desc: '7-day advance warning for expiring API tokens', enabled: true },
                    { label: 'Sync completion', desc: 'Notify when a full sync completes', enabled: false },
                    { label: 'Stale documentation', desc: 'Detect runbooks older than 90 days', enabled: true },
                    { label: 'New team members', desc: 'When someone joins your workspace', enabled: false },
                    { label: 'AI confidence drops', desc: 'Alert when avg. confidence drops below 70%', enabled: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-10 h-5 bg-white/10 peer-checked:bg-accent-blue rounded-full transition-colors peer-checked:after:translate-x-5 after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-4">
                <h1 className="text-xl font-black">Security</h1>
                <div className="card p-6 space-y-4">
                  {[
                    { icon: Lock, label: 'Two-Factor Authentication', desc: '2FA is enabled for all admin accounts', badge: 'Enabled', badgeVariant: 'green' as const },
                    { icon: Shield, label: 'SSO / SAML', desc: 'Enterprise SSO integration', badge: 'Enterprise', badgeVariant: 'purple' as const },
                    { icon: Mail, label: 'Email Domain Restriction', desc: 'Limit invites to @company.com', badge: 'Active', badgeVariant: 'blue' as const },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-bg-elevated rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className="text-text-secondary" />
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                      <Badge variant={item.badgeVariant} size="sm">{item.badge}</Badge>
                    </div>
                  ))}
                </div>

                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <Lock size={14} className="text-accent-blue" />
                    <h3 className="font-semibold text-sm">API Key Management</h3>
                  </div>
                  <p className="text-xs text-text-secondary mb-4">API keys are stored encrypted. They are never exposed in the UI or logs.</p>
                  <div className="space-y-2">
                    {['GitHub Personal Access Token', 'Jira API Token', 'Slack Bot Token'].map(key => (
                      <div key={key} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent-green" />
                          <span className="text-xs text-text-secondary">{key}</span>
                        </div>
                        <span className="text-xs font-mono text-text-muted">••••••••••••••••</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 max-w-sm w-full mx-4"
          >
            <h3 className="font-bold text-lg mb-2">Invite Team Member</h3>
            <p className="text-sm text-text-secondary mb-6">Send an invite to your workspace.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-blue/40 transition-all text-text-primary placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as 'engineer' | 'viewer')}
                  className="w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none text-text-primary"
                >
                  <option value="engineer">Engineer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setInviteOpen(false)} className="btn-secondary flex-1 py-2">Cancel</button>
                <button onClick={handleInvite} className="btn-primary flex-1 py-2 flex items-center justify-center gap-2">
                  <Mail size={13} /> Send Invite
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
