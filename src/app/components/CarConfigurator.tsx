import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls, Loader, Html } from '@react-three/drei';
import { CarModel } from './CarModel';
import { ErrorBoundary } from './ErrorBoundary';
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
  },
  {
    id: 'bmw',
    name: 'BMW M4 (Upload Required)',
    url: 'https://github.com/baraasowwan1/octobous/blob/main/public/bmw.glb'
  },
  {
    id: 'mercedes',
    name: 'Mercedes AMG (Upload Required)',
    url: 'https://github.com/baraasowwan1/octobous/blob/main/public/mercedes.glb'
  },
];

export function CarConfigurator() {
  const [carColor, setCarColor] = useState(colors[0].value);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);

  const selectedCar = availableCars[selectedCarIndex];

  return (
    <div className="relative w-full h-[600px] md:h-[800px] bg-gradient-to-b from-gray-900 to-black overflow-hidden shadow-2xl">
      <ErrorBoundary>
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
      </ErrorBoundary>

      <Loader /> {/* Provides a beautiful loading bar overlay */}

      {/* Glassmorphism UI Overlay */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-4 md:gap-6 z-20 w-[95%] md:w-11/12 max-w-2xl pointer-events-auto">
        
        {/* Dropdown Car Selector */}
        <div className="w-full flex flex-col items-center gap-3 border-b border-white/10 pb-5">
           <label htmlFor="car-select" className="text-white/80 font-bold text-xs md:text-sm tracking-wider uppercase flex items-center gap-2 cursor-pointer">
             <Car className="w-4 h-4" /> Select Vehicle
           </label>
           <div className="relative w-full max-w-xs">
             <select 
               id="car-select"
               value={selectedCarIndex}
               onChange={(e) => setSelectedCarIndex(Number(e.target.value))}
               className="w-full appearance-none bg-black/60 text-white border border-white/20 rounded-xl px-4 py-3 text-center text-sm md:text-base font-semibold outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all cursor-pointer shadow-inner"
             >
               {availableCars.map((car, idx) => (
                 <option key={car.id} value={idx} className="bg-gray-900 text-white">
                   {car.name}
                 </option>
               ))}
             </select>
             {/* Custom Dropdown Arrow */}
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
             </div>
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
