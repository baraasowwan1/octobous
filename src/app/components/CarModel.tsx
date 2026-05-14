import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!scene) return;

    // --- 1. NORMALIZE DIMENSIONS AND CENTER THE CAR ---
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      const desiredSize = 4.5; 
      const scale = desiredSize / maxDim;
      scene.scale.setScalar(scale);
    }

    const newBox = new THREE.Box3().setFromObject(scene);
    const center = newBox.getCenter(new THREE.Vector3());
    const bottomY = newBox.min.y;
    
    scene.position.x -= center.x;
    scene.position.z -= center.z;
    scene.position.y -= bottomY; 

    // --- 2. DETECT AND UPDATE CAR PAINT FOR THE ENTIRE BODY ---
    scene.traverse((child: any) => {
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

        // If it passed the above filters, it is almost certainly a painted body panel!
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color),
          metalness: 0.7,         // Realistic metallic car paint
          roughness: 0.15,        // Very smooth
          clearcoat: 1.0,         // Thick clearcoat layer
          clearcoatRoughness: 0.1,// Smooth clearcoat
          envMapIntensity: 2.0    // Strong reflections from the environment
        });
      }
    });
  }, [scene, color]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
