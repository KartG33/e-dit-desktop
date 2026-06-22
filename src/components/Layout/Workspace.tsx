import React from 'react';
import { SplitView } from '../Editor/SplitView';
import { TextEditor } from '../Editor/TextEditor';
import { EditorToolbar } from '../Editor/EditorToolbar';
import { NotesSidebar } from '../Notes/NotesSidebar';
import { useEditor } from '../../hooks/useEditor';
import { open, save } from '@tauri-apps/api/dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs';

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
  const handleOpenFile = async (editor: EditorInstance) => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: 'Text', extensions: ['txt', 'md', 'lyrics'] }]
      });
      if (selected && typeof selected === 'string') {
        const content = await readTextFile(selected);
        editor.setText(content);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveFile = async (editor: EditorInstance) => {
    try {
      const filePath = await save({
        filters: [{ name: 'Text', extensions: ['txt', 'md', 'lyrics'] }]
      });
      if (filePath) {
        await writeTextFile(filePath, editor.text);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
            onOpen={handleOpenFile}
            onSave={handleSaveFile}
          />
        ) : (
          <TextEditor
            value={leftEditor.text}
            onChange={leftEditor.setText}
            placeholder="Введите или вставьте текст..."
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) leftEditor.redo();
                else leftEditor.undo();
              } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                leftEditor.redo();
              } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                handleSaveFile(leftEditor);
              } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                handleOpenFile(leftEditor);
              }
            }}
          />
        )}
        
        <EditorToolbar
          onUndo={activeEditor.undo}
          onRedo={activeEditor.redo}
          canUndo={activeEditor.canUndo}
          canRedo={activeEditor.canRedo}
          onClear={activeEditor.clear}
          text={activeEditor.text}
          onOpen={() => handleOpenFile(activeEditor)}
          onSave={() => handleSaveFile(activeEditor)}
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
