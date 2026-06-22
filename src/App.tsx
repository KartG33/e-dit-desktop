import { useState } from 'react';
import { useEditor } from './hooks/useEditor';
import { BasicCommands } from './components/Commands/BasicCommands';
import { SunoCommands } from './components/Commands/SunoCommands';
import { PresetsTab } from './components/Presets/PresetsTab';
import { SymbolPanel } from './components/SymbolAnalyzer/SymbolPanel';
import { Header, TabType } from './components/Layout/Header';
import { Workspace } from './components/Layout/Workspace';

function App() {
  const leftEditor = useEditor('', 'left');
  const rightEditor = useEditor('', 'right');
  const [activePane, setActivePane] = useState<'left' | 'right'>('left');
  const [splitMode, setSplitMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  const activeEditor = splitMode 
    ? (activePane === 'left' ? leftEditor : rightEditor) 
    : leftEditor;

  return (
    <div className="h-screen flex flex-col text-white font-sans selection:bg-blue-500/30">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        charsCount={activeEditor.stats.chars}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
        splitMode={splitMode}
        setSplitMode={setSplitMode}
      />

      {/* Commands Content Panel */}
      <div className="border-b border-white/5 shrink-0 z-10 bg-white/[0.03] shadow-sm px-4 py-3 relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />
        {activeTab === 'basic' && <BasicCommands onCommand={activeEditor.applyCommand} />}
        {activeTab === 'suno' && <SunoCommands onCommand={activeEditor.applyCommand} />}
        {activeTab === 'presets' && <PresetsTab onCommand={activeEditor.applyCommand} />}
      </div>

      <SymbolPanel text={activeEditor.text} />

      <Workspace
        leftEditor={leftEditor}
        rightEditor={rightEditor}
        activeEditor={activeEditor}
        activePane={activePane}
        setActivePane={setActivePane}
        splitMode={splitMode}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
      />
    </div>
  );
}

export default App;
