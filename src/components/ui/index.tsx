import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'purple' | 'none';
  onClick?: () => void;
  padding?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children, className = '', hover = true, glow = 'none', onClick, padding = 'p-6',
}) => {
  const glowClass = glow === 'blue' ? 'hover:shadow-glow-blue' : glow === 'purple' ? 'hover:shadow-glow-purple' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        glass rounded-2xl ${padding} ${glowClass}
        ${hover ? 'hover:border-blue-500/20 cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'gray' | 'cyan';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', size = 'sm', dot = false }) => {
  const colors = {
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    green: 'bg-green-500/15 text-green-400 border-green-500/20',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    red: 'bg-red-500/15 text-red-400 border-red-500/20',
    gray: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  };
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1' };
  const dotColors = {
    blue: 'bg-blue-400', purple: 'bg-purple-400', green: 'bg-green-400',
    orange: 'bg-orange-400', red: 'bg-red-400', gray: 'bg-slate-400', cyan: 'bg-cyan-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colors[variant]} ${sizes[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines = 1 }) => {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`} />
        ))}
      </div>
    );
  }
  return <div className={`skeleton ${className}`} />;
};

export const AITypingIndicator: React.FC = () => (
  <div className="flex items-center gap-2 px-4 py-3">
    <div className="flex items-center gap-1.5 bg-bg-card rounded-full px-3 py-2 border border-white/5">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="text-xs text-text-secondary ml-1">Thinking...</span>
    </div>
  </div>
);

interface ConfidenceBarProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ score, showLabel = true, size = 'md' }) => {
  const color = score >= 85 ? '#22C55E' : score >= 65 ? '#F59E0B' : '#EF4444';
  const label = score >= 85 ? 'High' : score >= 65 ? 'Medium' : 'Low';
  const height = size === 'sm' ? 'h-1' : 'h-1.5';

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className="text-xs text-text-secondary whitespace-nowrap">Confidence</span>
      )}
      <div className={`flex-1 bg-white/5 rounded-full ${height} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold" style={{ color }}>
          {score}% · {label}
        </span>
      )}
    </div>
  );
};

interface CitationChipProps {
  type: 'github' | 'jira' | 'slack' | 'runbook';
  title: string;
  relevance?: number;
  onClick?: () => void;
}

export const CitationChip: React.FC<CitationChipProps> = ({ type, title, relevance, onClick }) => {
  const config = {
    github: { color: 'border-slate-500/30 bg-slate-500/10 text-slate-300', label: 'GH', icon: '⬡' },
    jira: { color: 'border-blue-500/30 bg-blue-500/10 text-blue-300', label: 'JR', icon: '◆' },
    slack: { color: 'border-purple-500/30 bg-purple-500/10 text-purple-300', label: 'SL', icon: '#' },
    runbook: { color: 'border-green-500/30 bg-green-500/10 text-green-300', label: 'RB', icon: '▶' },
  };
  const { color, label } = config[type];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:scale-105 ${color}`}
    >
      <span className="font-mono text-[10px] opacity-60">{label}</span>
      <span className="truncate max-w-[180px]">{title}</span>
      {relevance && (
        <span className="opacity-50 text-[10px]">{Math.round(relevance * 100)}%</span>
      )}
    </button>
  );
};

interface SyncStatusProps {
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  label?: string;
  showLabel?: boolean;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ status, label, showLabel = true }) => {
  const config = {
    connected: { color: 'text-green-400', bg: 'bg-green-400', text: label || 'Connected' },
    disconnected: { color: 'text-slate-400', bg: 'bg-slate-400', text: label || 'Disconnected' },
    syncing: { color: 'text-blue-400', bg: 'bg-blue-400', text: label || 'Syncing...' },
    error: { color: 'text-red-400', bg: 'bg-red-400', text: label || 'Error' },
  };
  const { color, bg, text } = config[status];

  return (
    <div className={`flex items-center gap-1.5 ${color}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bg} opacity-75 ${status !== 'syncing' ? 'hidden' : ''}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${bg}`} />
      </span>
      {showLabel && <span className="text-xs font-medium">{text}</span>}
    </div>
  );
};

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', color }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  const colors = ['#4F8CFF', '#8B5CF6', '#22C55E', '#F59E0B', '#06B6D4', '#EF4444'];
  const autoColor = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color || autoColor}88, ${color || autoColor})` }}
    >
      {initials}
    </div>
  );
};

export const SpinnerIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#4F8CFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
