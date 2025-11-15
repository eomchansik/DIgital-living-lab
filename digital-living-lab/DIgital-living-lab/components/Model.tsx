import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

interface ModelProps {
  path: string;
  color: string;
}

const Model: React.FC<ModelProps> = ({ path, color }) => {
  const geom = useLoader(STLLoader, path);

  const { centeredGeom, scale } = useMemo(() => {
    // Clone the geometry to avoid modifying the cached asset
    const geometry = geom.clone();
    
    // Compute the bounding box to find the center and size
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;

    // If bounding box can't be computed, return original geometry
    if (!box) {
      return { centeredGeom: geometry, scale: 1 };
    }
    
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Translate the geometry to move its center to the origin (0,0,0)
    geometry.translate(-center.x, -center.y, -center.z);

    // Normalize the size
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const desiredSize = 80; // A reasonable size to fit in the camera view
    const scaleFactor = desiredSize / maxDim;

    return { centeredGeom: geometry, scale: scaleFactor };
  }, [geom]);

  return (
    <mesh 
        geometry={centeredGeom}
        // Apply the required -90 degree rotation on the X-axis to make the model stand upright
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={scale}
    >
      <meshStandardMaterial color={color} flatShading={false} />
    </mesh>
  );
};

export default Model;
