import React from 'react';
import { Command } from '../../lib/commands/types';

interface CommandButtonProps {
  command: Command;
  onClick: () => void;
}

export const CommandButton: React.FC<CommandButtonProps> = ({ command, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] glass-button text-gray-200"
      title={command.description || command.name}
    >
      <span className="font-medium">{command.name}</span>
    </button>
  );
};
