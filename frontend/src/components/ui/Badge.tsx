import React from 'react';

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
