import React from 'react';

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
