import React from 'react';
import { X, Sliders } from 'lucide-react';
import { PresetsTab } from './PresetsTab';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (fn: (text: string) => string) => void;
  favoritePresetIds?: number[];
  onToggleFavoritePreset?: (id: number) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({ 
  isOpen, 
  onClose, 
  onCommand,
  favoritePresetIds = [],
  onToggleFavoritePreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-[#0f1219]/95 border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Sliders size={18} className="text-blue-400" />
            Управление пресетами
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto pt-4 pr-1">
          <PresetsTab 
            onCommand={onCommand} 
            favoritePresetIds={favoritePresetIds}
            onToggleFavoritePreset={onToggleFavoritePreset}
          />
        </div>
      </div>
    </div>
  );
};
