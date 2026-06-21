import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db/schema';
import { Save, FileText, Trash2, Plus, X } from 'lucide-react';

interface Props {
  currentText: string;
  onLoadText: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const NotesSidebar: React.FC<Props> = ({ currentText, onLoadText, isOpen, onClose }) => {
  const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray());
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen) return null;

  const handleSaveNew = async () => {
    if (!currentText.trim()) return;
    const title = newTitle.trim() || 'Заметка ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = await db.notes.add({
      title,
      content: currentText,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    setActiveNoteId(id as number);
    setNewTitle('');
  };

  const handleUpdate = async (id: number) => {
    await db.notes.update(id, {
      content: currentText,
      updatedAt: Date.now()
    });
  };

  const handleLoad = (id: number, content: string) => {
    setActiveNoteId(id);
    onLoadText(content);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await db.notes.delete(id);
    if (activeNoteId === id) setActiveNoteId(null);
  };

  return (
    <div className="w-64 bg-secondary border-l border-gray-700 flex flex-col h-full shrink-0 z-20">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2"><FileText size={16} /> Заметки</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded"><X size={16}/></button>
      </div>

      <div className="p-3 border-b border-gray-700 flex flex-col gap-2 bg-[#0F1219]">
        {activeNoteId ? (
          <button
            onClick={() => handleUpdate(activeNoteId)}
            className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={14} /> Сохранить текущую
          </button>
        ) : null}
        
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Название..." 
            className="flex-1 bg-primary border border-gray-700 px-2 py-1 text-sm rounded outline-none focus:border-blue-500"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSaveNew()}
          />
          <button
            onClick={handleSaveNew}
            title="Сохранить как новую"
            className="p-1.5 bg-accent hover:bg-blue-600 rounded transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {notes?.map(note => (
          <div 
            key={note.id}
            onClick={() => handleLoad(note.id!, note.content)}
            className={`p-2 rounded cursor-pointer group flex justify-between items-start transition-colors ${activeNoteId === note.id ? 'bg-blue-900/30 border border-blue-800' : 'hover:bg-gray-800 border border-transparent'}`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate text-gray-200">{note.title}</div>
              <div className="text-xs text-gray-500 truncate mt-0.5">{new Date(note.updatedAt).toLocaleString()}</div>
            </div>
            <button 
              onClick={(e) => handleDelete(e, note.id!)}
              className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-gray-700 ml-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {notes?.length === 0 && <div className="text-gray-500 text-sm text-center mt-6">Нет сохраненных заметок</div>}
      </div>
    </div>
  );
};
