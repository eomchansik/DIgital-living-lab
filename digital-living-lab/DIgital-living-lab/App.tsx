import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Viewer from './components/Viewer';
import type { Library } from './types';

const App: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([
    { id: 1, name: '제1도서관', path: '/library-a.stl', color: '#38bdf8' }, // sky-400
    { id: 2, name: 'AIJ 도서관', path: '/library-b.stl', color: '#2dd4bf' }, // teal-400
    { id: 3, name: '제3도서관', path: '/library-c.stl', color: '#fb923c' }, // orange-400
  ]);

  const [selectedLibraryId, setSelectedLibraryId] = useState<number>(1);

  const handleUpdateLibraryName = (id: number, newName: string) => {
    setLibraries(prevLibraries =>
      prevLibraries.map(lib => (lib.id === id ? { ...lib, name: newName } : lib))
    );
  };

  const selectedLibrary = useMemo(() => 
    libraries.find(lib => lib.id === selectedLibraryId), 
    [libraries, selectedLibraryId]
  );

  return (
    <div className="flex h-screen w-screen font-sans text-gray-800">
      <Sidebar
        libraries={libraries}
        selectedLibraryId={selectedLibraryId}
        onSelectLibrary={setSelectedLibraryId}
        onUpdateLibraryName={handleUpdateLibraryName}
      />
      <main className="flex-1 bg-gray-200 relative">
        {selectedLibrary ? (
          <Viewer library={selectedLibrary} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-xl text-gray-500">도서관을 선택해주세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;