import React from 'react';
import { SplitView } from '../Editor/SplitView';
import { TextEditor } from '../Editor/TextEditor';
import { EditorToolbar } from '../Editor/EditorToolbar';
import { NotesSidebar } from '../Notes/NotesSidebar';
import { useEditor } from '../../hooks/useEditor';

type EditorInstance = ReturnType<typeof useEditor>;

interface WorkspaceProps {
  leftEditor: EditorInstance;
  rightEditor: EditorInstance;
  activeEditor: EditorInstance;
  activePane: 'left' | 'right';
  setActivePane: (pane: 'left' | 'right') => void;
  splitMode: boolean;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  leftEditor,
  rightEditor,
  activeEditor,
  activePane,
  setActivePane,
  splitMode,
  showNotes,
  setShowNotes
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {splitMode ? (
          <SplitView 
            leftEditor={leftEditor}
            rightEditor={rightEditor}
            activePane={activePane}
            setActivePane={setActivePane}
          />
        ) : (
          <TextEditor
            value={leftEditor.text}
            onChange={leftEditor.setText}
            placeholder="Введите или вставьте текст..."
          />
        )}
        
        <EditorToolbar
          onUndo={activeEditor.undo}
          onRedo={activeEditor.redo}
          canUndo={activeEditor.canUndo}
          canRedo={activeEditor.canRedo}
          onClear={activeEditor.clear}
          text={activeEditor.text}
        />
      </div>

      <NotesSidebar 
        currentText={activeEditor.text}
        onLoadText={activeEditor.setText}
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
      />
    </div>
  );
};
