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
  // public/models/

  const modelPath = '/defender.gltf';

  const gltf = useGLTF(modelPath) as any;

  const { scene, materials, nodes } = gltf;

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materialName = child.material.name?.toLowerCase?.() || '';
        const meshName = child.name?.toLowerCase?.() || '';

        // Try detecting car body materials
        if (
          materialName.includes('body') ||
          materialName.includes('paint') ||
          materialName.includes('car') ||
          meshName.includes('body')
        ) {
          child.material = child.material.clone();
          child.material.color = new THREE.Color(color);
          child.material.needsUpdate = true;
        }

        child.castShadow = true;
        child.receiveShadow = true;
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
useGLTF.preload('/models/defender.gltf');
