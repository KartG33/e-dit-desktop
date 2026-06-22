import React from 'react';

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ 
  label, 
  isActive, 
  ...props 
}) => {
  return (
    <button
      {...props}
      className={`px-5 py-2 text-sm font-medium rounded-t-xl transition-all duration-300 relative ${
        isActive
          ? 'text-blue-400 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
      }`}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] rounded-t-full" />
      )}
    </button>
  );
};
