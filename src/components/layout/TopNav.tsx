import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, Check, Wifi } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData';
import { Avatar, Badge } from '../ui';

const TopNav: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const statusIndicators = [
    { label: 'GitHub', color: '#22C55E', status: 'ok' },
    { label: 'Jira', color: '#22C55E', status: 'ok' },
    { label: 'Slack', color: '#F59E0B', status: 'warn' },
    { label: 'AI', color: '#22C55E', status: 'ok' },
  ];

  const notifTypeConfig = {
    info: 'text-blue-400', warning: 'text-orange-400', error: 'text-red-400', success: 'text-green-400',
  };

  return (
    <header className="h-[60px] bg-bg-card/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search projects, questions, decisions..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={`
            w-full bg-bg-elevated border rounded-xl pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted
            outline-none transition-all duration-200
            ${searchFocused ? 'border-accent-blue/40 shadow-glow-blue' : 'border-white/5 hover:border-white/10'}
          `}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted border border-white/10 rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* API Status Indicators */}
      <div className="hidden md:flex items-center gap-3 border-l border-white/5 pl-4">
        <Wifi size={12} className="text-text-muted" />
        {statusIndicators.map(ind => (
          <div key={ind.label} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ind.color, boxShadow: `0 0 6px ${ind.color}` }} />
            <span className="text-[11px] text-text-secondary">{ind.label}</span>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-9 h-9 rounded-xl bg-bg-elevated border border-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-white/10 transition-all"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-bg-primary">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 glass rounded-2xl border border-white/10 overflow-hidden shadow-card z-50"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold">Notifications</span>
                <Badge variant="blue" size="sm">{unreadCount} new</Badge>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors ${!notif.read ? 'bg-white/2' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className={`text-xs mt-0.5 ${notifTypeConfig[notif.type]}`}>●</span>
                      <div>
                        <div className="text-xs font-semibold text-text-primary">{notif.title}</div>
                        <div className="text-[11px] text-text-secondary mt-0.5">{notif.message}</div>
                        <div className="text-[10px] text-text-muted mt-1">{notif.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Role Switcher (Demo) */}
      <div ref={roleRef} className="relative">
        <button
          onClick={() => setRoleOpen(!roleOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated border border-white/5 hover:border-white/10 transition-all"
        >
          <Avatar initials={user?.avatar || 'U'} size="sm" />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-text-primary">{user?.name}</div>
            <div className="text-[10px] text-text-secondary capitalize">{user?.role}</div>
          </div>
          <ChevronDown size={12} className="text-text-secondary" />
        </button>

        <AnimatePresence>
          {roleOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-48 glass rounded-xl border border-white/10 overflow-hidden shadow-card z-50"
            >
              <div className="p-2">
                <div className="text-[10px] text-text-muted px-2 py-1 uppercase tracking-wider">Switch Demo Role</div>
                {(['admin', 'engineer', 'viewer'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => { switchRole(role); setRoleOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-sm capitalize text-text-secondary">{role}</span>
                    {user?.role === role && <Check size={12} className="text-accent-blue" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default TopNav;
