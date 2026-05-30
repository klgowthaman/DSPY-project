import React from 'react';
import { motion } from 'framer-motion';

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
