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
