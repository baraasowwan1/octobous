import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { CarModel } from './CarModel';
import { motion } from 'motion/react';

const colors = [
  { name: 'Racing Red', value: '#ff0000' },
  { name: 'Midnight Black', value: '#111111' },
  { name: 'Pearl White', value: '#ffffff' },
  { name: 'Cyber Yellow', value: '#ffcc00' },
  { name: 'Ocean Blue', value: '#0055ff' },
  { name: 'Matte Grey', value: '#444444' }
];

export function CarConfigurator() {
  const [carColor, setCarColor] = useState(colors[0].value);

  return (
    <div className="relative w-full h-[600px] md:h-[800px] bg-gradient-to-b from-gray-900 to-black overflow-hidden shadow-2xl">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [6, 2, 8], fov: 40 }}>
        <color attach="background" args={['#101010']} />
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.7} 
            polar={[-0.1, Math.PI / 4]}
          >
            <CarModel color={carColor} scale={1} position={[0, -0.6, 0]} />
          </PresentationControls>
          <ContactShadows position={[0, -0.6, 0]} opacity={0.75} scale={20} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>
        
        {/* We use OrbitControls to allow zooming, but disable panning to keep the car centered */}
        <OrbitControls enablePan={false} enableZoom={true} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2.1} />
      </Canvas>

      {/* Glassmorphism UI Overlay */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-2 md:gap-4 z-20 w-[95%] md:w-11/12 max-w-md pointer-events-auto">
        <h3 className="text-white font-bold text-lg md:text-xl tracking-wider uppercase">Choose Your Wrap</h3>
        <p className="text-white/70 text-xs md:text-sm mb-1 text-center">Interact with the 3D model to view from all angles.</p>
        <div className="flex gap-2 md:gap-4 flex-wrap justify-center mt-2">
          {colors.map((c) => (
            <motion.button
              key={c.value}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCarColor(c.value)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-all shadow-lg ${carColor === c.value ? 'border-white scale-110' : 'border-transparent opacity-80 hover:opacity-100'}`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
