import React from 'react';
import { TextEditor } from './TextEditor';

interface SplitViewProps {
  leftEditor: any;
  rightEditor: any;
  activePane: 'left' | 'right';
  setActivePane: (pane: 'left' | 'right') => void;
}

export const SplitView: React.FC<SplitViewProps> = ({
  leftEditor,
  rightEditor,
  activePane,
  setActivePane
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col border-r border-white/5 relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-blue-500/20 after:to-transparent">
        <TextEditor
          value={leftEditor.text}
          onChange={leftEditor.setText}
          isActive={activePane === 'left'}
          onClick={() => setActivePane('left')}
          placeholder="Левая колонка (нажмите для редактирования)..."
        />
      </div>
      <div className="flex-1 flex flex-col">
        <TextEditor
          value={rightEditor.text}
          onChange={rightEditor.setText}
          isActive={activePane === 'right'}
          onClick={() => setActivePane('right')}
          placeholder="Правая колонка (нажмите для редактирования)..."
        />
      </div>
    </div>
  );
};
