
import React, { useState, useRef, useEffect } from 'react';
import type { Library } from '../types';

interface SidebarProps {
  libraries: Library[];
  selectedLibraryId: number;
  onSelectLibrary: (id: number) => void;
  onUpdateLibraryName: (id: number, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  libraries,
  selectedLibraryId,
  onSelectLibrary,
  onUpdateLibraryName,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleStartEdit = (library: Library) => {
    setEditingId(library.id);
    setEditText(library.name);
  };

  const handleSaveEdit = () => {
    if (editingId !== null && editText.trim() !== '') {
      onUpdateLibraryName(editingId, editText.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white shadow-lg p-4 flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">디지털 리빙랩</h1>
        <p className="text-sm text-gray-500">3D 도서관 뷰어</p>
      </header>
      <nav>
        <ul className="space-y-2">
          {libraries.map(lib => {
            const isSelected = lib.id === selectedLibraryId;
            const isEditing = lib.id === editingId;

            return (
              <li key={lib.id}>
                <div
                  onClick={() => !isEditing && onSelectLibrary(lib.id)}
                  onDoubleClick={() => handleStartEdit(lib)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div style={{ backgroundColor: lib.color }} className="w-3 h-3 rounded-full mr-3 flex-shrink-0"></div>
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent text-inherit p-0 border-b border-dashed focus:outline-none"
                    />
                  ) : (
                    <span className="font-medium truncate">{lib.name}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      <footer className="mt-auto text-center text-xs text-gray-400">
        <p>목록 아이템을 더블클릭하여 이름을 수정하세요.</p>
      </footer>
    </aside>
  );
};

export default Sidebar;
