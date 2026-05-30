import React from 'react';

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
