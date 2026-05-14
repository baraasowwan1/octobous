import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type CarModelProps = {
  color?: string;
  modelUrl: string;
  [key: string]: any;
};

export function CarModel({
  color = '#ff0000',
  modelUrl,
  ...props
}: CarModelProps) {
  const group = useRef<THREE.Group>(null);

  const gltf = useGLTF(modelUrl) as any;
  const { scene } = gltf;

  // Clone the scene so we don't mutate the cached model across swaps
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    // --- 1. NORMALIZE DIMENSIONS AND CENTER THE CAR ---
    clonedScene.scale.set(1, 1, 1);
    clonedScene.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      const desiredSize = 4.5; 
      const scale = desiredSize / maxDim;
      clonedScene.scale.setScalar(scale);
    }

    const newBox = new THREE.Box3().setFromObject(clonedScene);
    const center = newBox.getCenter(new THREE.Vector3());
    const bottomY = newBox.min.y;
    
    clonedScene.position.x -= center.x;
    clonedScene.position.z -= center.z;
    clonedScene.position.y -= bottomY; 

    // --- 2. DETECT AND UPDATE CAR PAINT FOR THE ENTIRE BODY ---
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Skip transparent materials (glass, windows, headlights)
        if (child.material.transparent || child.material.opacity < 1) return;

        const materialName = child.material.name?.toLowerCase?.() || '';
        const meshName = child.name?.toLowerCase?.() || '';

        // Skip obvious non-paint parts by name
        if (
          materialName.includes('glass') || materialName.includes('tire') || 
          materialName.includes('wheel') || materialName.includes('rubber') || 
          materialName.includes('interior') || materialName.includes('chrome') || 
          materialName.includes('black') || meshName.includes('tire') || 
          meshName.includes('wheel')
        ) {
          return;
        }

        // Skip very dark materials (usually plastic trims, grilles, undercarriage)
        const hsl = { h: 0, s: 0, l: 0 };
        if (child.material.color) {
          child.material.color.getHSL(hsl);
          if (hsl.l < 0.15) return; // Luminance is very low, it's dark trim.
        }

        // Strip away any baked-in color maps (dirt, baked lighting) so the pure color pops!
        const clearMap = null;

        // If it passed the above filters, it is almost certainly a painted body panel!
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color),
          map: clearMap,          // Ensure no texture overrides our pure color
          metalness: 0.7,         // Realistic metallic car paint
          roughness: 0.15,        // Very smooth
          clearcoat: 1.0,         // Thick clearcoat layer
          clearcoatRoughness: 0.1,// Smooth clearcoat
          envMapIntensity: 2.0    // Strong reflections from the environment
        });
        
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, color]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}
