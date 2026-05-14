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

    // --- 2. DETECT AND UPDATE CAR PAINT ---
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Extract the material safely
        const mat = Array.isArray(child.material) ? child.material[0] : child.material;
        if (!mat || typeof mat.clone !== 'function') return;

        // Skip transparent materials (glass, windows, headlights)
        if (mat.transparent || mat.opacity < 1) return;

        const materialName = mat.name?.toLowerCase?.() || '';
        const meshName = child.name?.toLowerCase?.() || '';

        // Skip ONLY obvious non-paint parts by name (removed 'black' to allow painting default-black cars)
        if (
          materialName.includes('glass') || materialName.includes('tire') || 
          materialName.includes('wheel') || materialName.includes('rubber') || 
          materialName.includes('interior') || materialName.includes('chrome') || 
          materialName.includes('grill') || materialName.includes('window') ||
          meshName.includes('tire') || meshName.includes('wheel') || meshName.includes('glass')
        ) {
          return;
        }

        // We clone the original material to preserve its details (like Normal Maps for panel gaps)
        const originalMat = mat.clone();
        
        // Upgrade to a highly realistic PhysicalMaterial if it isn't one already
        let newMat;
        if (originalMat.isMeshStandardMaterial && !originalMat.isMeshPhysicalMaterial) {
          newMat = new THREE.MeshPhysicalMaterial().copy(originalMat);
        } else {
          newMat = originalMat;
        }

        // Apply our custom paint over the existing detailed material
        newMat.color = new THREE.Color(color);
        newMat.map = null; // Strip the base color map so our custom color pops
        
        newMat.metalness = 0.7; // Realistic metallic car paint
        newMat.roughness = 0.15; // Very smooth
        
        if (newMat.isMeshPhysicalMaterial) {
          newMat.clearcoat = 1.0; // Thick clearcoat layer
          newMat.clearcoatRoughness = 0.1; // Smooth clearcoat
        }
        
        newMat.envMapIntensity = 2.0; // Strong reflections from the environment
        newMat.needsUpdate = true;
        
        // Safely reassign the updated material
        if (Array.isArray(child.material)) {
           child.material[0] = newMat;
        } else {
           child.material = newMat;
        }
      }
    });
  }, [clonedScene, color]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}
