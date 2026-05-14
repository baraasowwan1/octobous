import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function CarModel({ color = '#ff0000', ...props }: { color?: string; [key: string]: any }) {
  const group = useRef<THREE.Group>(null);
  
  // We now look for a local defender model in the public folder.
  // IMPORTANT: You must place a 3D model named "defender.glb" inside your "public" directory.
  const { nodes, materials } = useGLTF('/defender.glb') as any;
  
  // Update colors safely when the color prop changes
  useEffect(() => {
    if (!materials) return;
    
    // Traverse all materials and update any that might be the car body
    Object.values(materials).forEach((mat: any) => {
      const name = mat.name.toLowerCase();
      // The ferrari model body material is often named "body" or "paint"
      if (name.includes('body') || name.includes('paint') || name.includes('car')) {
        mat.color.set(color);
        mat.needsUpdate = true;
      }
    });
    
    // Also try to find meshes directly in case material names are generic
    if (nodes) {
      Object.values(nodes).forEach((node: any) => {
        if (node.isMesh && node.name.toLowerCase().includes('body')) {
          if (node.material) {
            node.material.color.set(color);
            node.material.needsUpdate = true;
          }
        }
      });
    }
  }, [color, materials, nodes]);

  // Find the root object
  const rootObject = nodes.Scene || nodes._rootJoint || Object.values(nodes)[0];

  return (
    <group ref={group} {...props} dispose={null}>
      {rootObject && <primitive object={rootObject} />}
    </group>
  );
}

useGLTF.preload('/defender.glb');
