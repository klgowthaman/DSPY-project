import React from 'react';

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
