import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls, Loader, Html } from '@react-three/drei';
import { CarModel } from './CarModel';
import { motion } from 'motion/react';
import { Car } from 'lucide-react';

const colors = [
  { name: 'Racing Red', value: '#ff0000' },
  { name: 'Midnight Black', value: '#111111' },
  { name: 'Pearl White', value: '#ffffff' },
  { name: 'Cyber Yellow', value: '#ffcc00' },
  { name: 'Ocean Blue', value: '#0055ff' },
  { name: 'Matte Grey', value: '#444444' }
];

// Array of available 3D car models
const availableCars = [
  {
    id: 'defender',
    name: 'Land Rover Defender',
    url: 'https://raw.githubusercontent.com/baraasowwan1/octobous/main/public/defender.gltf'
  },
  {
    id: 'ferrari',
    name: 'Ferrari 458 Italia',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/ferrari.glb'
  }
];

export function CarConfigurator() {
  const [carColor, setCarColor] = useState(colors[0].value);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);

  const selectedCar = availableCars[selectedCarIndex];

  return (
    <div className="relative w-full h-[600px] md:h-[800px] bg-gradient-to-b from-gray-900 to-black overflow-hidden shadow-2xl">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [6, 2, 8], fov: 40 }}>
        <color attach="background" args={['#101010']} />
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4 bg-black/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md w-64">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white text-lg font-bold text-center">Loading<br/><span className="text-red-400">{selectedCar.name}</span>...</div>
            </div>
          </Html>
        }>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.7} 
            polar={[-0.1, Math.PI / 4]}
          >
            {/* The key prop ensures the component fully remounts and resets state when switching models */}
            <CarModel key={selectedCar.id} modelUrl={selectedCar.url} color={carColor} />
          </PresentationControls>
          <ContactShadows position={[0, -0.6, 0]} opacity={0.75} scale={20} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls enablePan={false} enableZoom={true} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2.1} />
      </Canvas>

      <Loader /> {/* Provides a beautiful loading bar overlay */}

      {/* Glassmorphism UI Overlay */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-4 md:gap-6 z-20 w-[95%] md:w-11/12 max-w-2xl pointer-events-auto">
        
        {/* Car Selector */}
        <div className="w-full flex flex-col items-center gap-3 border-b border-white/10 pb-5">
           <h3 className="text-white/80 font-bold text-xs md:text-sm tracking-wider uppercase flex items-center gap-2">
             <Car className="w-4 h-4" /> Select Vehicle
           </h3>
           <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
             {availableCars.map((car, idx) => (
               <button
                 key={car.id}
                 onClick={() => setSelectedCarIndex(idx)}
                 className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                   selectedCarIndex === idx 
                     ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105' 
                     : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                 }`}
               >
                 {car.name}
               </button>
             ))}
           </div>
        </div>

        {/* Color Selector */}
        <div className="w-full flex flex-col items-center gap-2">
          <h3 className="text-white font-bold text-base md:text-xl tracking-wider uppercase">Choose Your Wrap</h3>
          <p className="text-white/50 text-[10px] md:text-sm mb-1 text-center">Interact with the 3D model to view from all angles.</p>
          <div className="flex gap-3 md:gap-4 flex-wrap justify-center mt-1">
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
    </div>
  );
}
