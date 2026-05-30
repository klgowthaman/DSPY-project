import React from 'react';

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
