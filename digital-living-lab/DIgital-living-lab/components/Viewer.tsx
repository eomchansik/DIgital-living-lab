
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, CameraControls } from '@react-three/drei';
import type { CameraControls as CameraControlsImpl } from '@react-three/drei';
import Model from './Model';
import type { Library } from '../types';

interface ViewerProps {
  library: Library;
}

const cameraPresets = [
  { name: '기본', position: [100, 100, 100] as [number, number, number] },
  { name: '정면', position: [0, 0, 150] as [number, number, number] },
  { name: '상단', position: [0, 150, 0] as [number, number, number] },
  { name: '측면', position: [150, 0, 0] as [number, number, number] },
];


const Viewer: React.FC<ViewerProps> = ({ library }) => {
  const cameraControlsRef = useRef<CameraControlsImpl>(null!);

  useEffect(() => {
    // When the library model changes, smoothly reset the camera to the default view.
    if (cameraControlsRef.current) {
        cameraControlsRef.current.setLookAt(100, 100, 100, 0, 0, 0, true);
    }
  }, [library]);

  const setView = (position: [number, number, number]) => {
    cameraControlsRef.current?.setLookAt(...position, 0, 0, 0, true);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        {cameraPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setView(preset.position)}
            className="px-3 py-1.5 bg-white bg-opacity-80 backdrop-blur-sm rounded-md shadow-md text-gray-700 font-semibold text-sm hover:bg-opacity-100 hover:shadow-lg transition-all"
            aria-label={`${preset.name} 뷰로 변경`}
          >
            {preset.name}
          </button>
        ))}
      </div>
      <Canvas camera={{ position: [100, 100, 100], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        
        <Suspense fallback={null}>
          <Model key={library.path} path={library.path} color={library.color} />
        </Suspense>
        
        <CameraControls ref={cameraControlsRef} makeDefault />
      </Canvas>
      <Loader />
    </div>
  );
};

export default Viewer;
