import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type CarModelProps = {
  color?: string;
  [key: string]: any;
};

export function CarModel({
  color = '#ff0000',
  ...props
}: CarModelProps) {
  const group = useRef<THREE.Group>(null);

  // IMPORTANT:
  // Put defender.gltf + scene.bin + textures inside:
  // public/

  const modelPath = 'https://raw.githubusercontent.com/baraasowwan1/octobous/main/public/defender.gltf';

  const gltf = useGLTF(modelPath) as any;

  const { scene } = gltf;

  useEffect(() => {
    if (!scene) return;

    // --- 1. NORMALIZE DIMENSIONS AND CENTER THE CAR ---
    // Reset any previous scale/position changes
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Normalize to a consistent size (e.g. 4 units long)
    if (maxDim > 0) {
      const desiredSize = 4.5; 
      const scale = desiredSize / maxDim;
      scene.scale.setScalar(scale);
    }

    // Center it horizontally, and place the bottom exactly at Y=0
    const newBox = new THREE.Box3().setFromObject(scene);
    const center = newBox.getCenter(new THREE.Vector3());
    const bottomY = newBox.min.y;
    
    scene.position.x -= center.x;
    scene.position.z -= center.z;
    scene.position.y -= bottomY; 

    // --- 2. DETECT AND UPDATE CAR PAINT MATERIAL ---
    let largestMesh: any = null;
    let maxVerts = 0;

    // Find the largest opaque mesh (usually the main car body)
    scene.traverse((child: any) => {
      if (child.isMesh && child.geometry && child.material && !child.material.transparent) {
         const verts = child.geometry.attributes.position.count;
         if (verts > maxVerts) {
           maxVerts = verts;
           largestMesh = child;
         }
      }
    });

    const targetMaterialName = largestMesh ? largestMesh.material.name : '';

    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const materialName = child.material.name?.toLowerCase?.() || '';
        const meshName = child.name?.toLowerCase?.() || '';

        // Check if this mesh shares the largest mesh's material, OR matches name heuristics
        const isBody = 
          (targetMaterialName && child.material.name === targetMaterialName) ||
          materialName.includes('body') ||
          materialName.includes('paint') ||
          materialName.includes('car') ||
          meshName.includes('body');

        if (isBody) {
          child.material = child.material.clone();
          child.material.color = new THREE.Color(color);
          
          // Make it look like glossy car paint
          if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
            child.material.roughness = 0.2;
            child.material.metalness = 0.6;
          }
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, color]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Preload model
useGLTF.preload('https://raw.githubusercontent.com/baraasowwan1/octobous/main/public/defender.gltf');
