import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, FolderOpen, GitBranch, Ticket, Hash,
  BookOpen, Network, BarChart3, Settings, ChevronLeft, ChevronRight,
  Zap, Users, ChevronDown, Check, LogOut, Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockWorkspaces } from '../../data/mockData';
import { Avatar } from '../ui';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'AI Assistant', icon: MessageSquare, path: '/ai', badge: 3 },
  { label: 'Projects', icon: FolderOpen, path: '/projects' },
  { label: 'Knowledge Graph', icon: Network, path: '/knowledge-graph' },
  { label: 'GitHub', icon: GitBranch, path: '/integrations' },
  { label: 'Jira', icon: Ticket, path: '/integrations' },
  { label: 'Slack', icon: Hash, path: '/integrations' },
  { label: 'Runbooks', icon: BookOpen, path: '/integrations' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Team', icon: Users, path: '/settings', adminOnly: true },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const { user, workspace, logout } = useAuth();
  const navigate = useNavigate();

  const filteredNav = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  // Deduplicate integration links to a single "Integrations"
  const deduped: NavItem[] = [];
  const integrationAdded = { flag: false };
  filteredNav.forEach(item => {
    if (['/integrations'].includes(item.path) && !integrationAdded.flag) {
      deduped.push({ label: 'Integrations', icon: Zap, path: '/integrations' });
      integrationAdded.flag = true;
    } else if (item.path !== '/integrations') {
      deduped.push(item);
    }
  });

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-bg-card border-r border-white/5 overflow-hidden flex-shrink-0 z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 min-h-[72px]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0">
          <Brain size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="font-bold text-sm text-text-primary whitespace-nowrap">IMA</div>
              <div className="text-[10px] text-text-secondary whitespace-nowrap">Institutional Memory</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Workspace Selector */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/5">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-blue/40 to-accent-purple/40 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-white">{workspace?.name?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text-primary truncate">{workspace?.name}</div>
              <div className="text-[10px] text-text-secondary">{workspace?.memberCount} members</div>
            </div>
            <ChevronDown size={12} className={`text-text-secondary transition-transform ${workspaceOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {workspaceOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mt-1 space-y-0.5 overflow-hidden"
              >
                {mockWorkspaces.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => { setWorkspaceOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-text-secondary">{ws.name[0]}</span>
                    </div>
                    <span className="text-xs text-text-secondary flex-1 truncate">{ws.name}</span>
                    {ws.id === workspace?.id && <Check size={10} className="text-accent-blue" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {deduped.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
              ${isActive
                ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }
            `}
          >
            <item.icon size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {item.badge && !collapsed && (
              <span className="ml-auto text-[10px] bg-accent-blue/20 text-accent-blue px-1.5 py-0.5 rounded-full font-semibold">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar initials={user?.avatar || 'U'} size="sm" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <div className="text-xs font-semibold text-text-primary truncate">{user?.name}</div>
                <div className="text-[10px] text-text-secondary capitalize">{user?.role}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { logout(); navigate('/'); }}
                className="text-text-secondary hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 w-6 h-6 bg-bg-elevated border border-white/10 rounded-full flex items-center justify-center text-text-secondary hover:text-accent-blue hover:border-accent-blue/30 transition-all z-30"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
