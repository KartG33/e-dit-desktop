import { useState } from 'react';
import { Columns, Maximize, FileText } from 'lucide-react';
import { useEditor } from './hooks/useEditor';
import { TextEditor } from './components/Editor/TextEditor';
import { EditorToolbar } from './components/Editor/EditorToolbar';

import { SplitView } from './components/Editor/SplitView';
import { BasicCommands } from './components/Commands/BasicCommands';
import { SunoCommands } from './components/Commands/SunoCommands';
import { PresetsTab } from './components/Presets/PresetsTab';
import { SymbolPanel } from './components/SymbolAnalyzer/SymbolPanel';
import { NotesSidebar } from './components/Notes/NotesSidebar';

function App() {
  const leftEditor = useEditor();
  const rightEditor = useEditor();
  const [activePane, setActivePane] = useState<'left' | 'right'>('left');
  const [splitMode, setSplitMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'suno' | 'presets'>('basic');

  const activeEditor = splitMode 
    ? (activePane === 'left' ? leftEditor : rightEditor) 
    : leftEditor;

  // Desktop Layout
  return (
    <div className="h-screen flex flex-col text-white font-sans selection:bg-blue-500/30">
      {/* Unified Header */}
      <header className="flex items-end justify-between px-4 pt-2 glass-panel border-b border-white/5 z-20 shadow-lg">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm pb-2">E-dit</h1>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-5 py-2 text-sm font-medium rounded-t-xl transition-all duration-300 relative ${
                activeTab === 'basic'
                  ? 'text-blue-400 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
              }`}
            >
              Команды
              {activeTab === 'basic' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('suno')}
              className={`px-5 py-2 text-sm font-medium rounded-t-xl transition-all duration-300 relative ${
                activeTab === 'suno'
                  ? 'text-blue-400 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
              }`}
            >
              Suno
              {activeTab === 'suno' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-5 py-2 text-sm font-medium rounded-t-xl transition-all duration-300 relative ${
                activeTab === 'presets'
                  ? 'text-blue-400 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
              }`}
            >
              Пресеты
              {activeTab === 'presets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] rounded-t-full" />}
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 pb-2 items-center">
          <div className="text-gray-300 text-sm font-medium mr-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner flex items-center gap-1.5">
            Символов: <span className="text-blue-400">{activeEditor.stats.chars}</span>
          </div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${showNotes ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white' : 'glass-button text-gray-300'}`}
            title="Заметки"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => setSplitMode(!splitMode)}
            className="p-1.5 glass-button rounded-lg text-gray-300"
            title={splitMode ? 'Одна колонка' : 'Две колонки'}
          >
            {splitMode ? <Maximize size={16} /> : <Columns size={16} />}
          </button>
        </div>
      </header>

      {/* Commands Content Panel */}
      <div className="border-b border-white/5 shrink-0 z-10 bg-white/[0.03] shadow-sm px-4 py-3 relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />
        {activeTab === 'basic' && <BasicCommands onCommand={activeEditor.applyCommand} />}
        {activeTab === 'suno' && <SunoCommands onCommand={activeEditor.applyCommand} />}
        {activeTab === 'presets' && <PresetsTab onCommand={activeEditor.applyCommand} />}
      </div>

      {/* Symbol Analyzer */}
      <SymbolPanel text={activeEditor.text} />

      {/* Main Content */}
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
    </div>
  );
}

export default App;
