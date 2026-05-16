import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SUGGESTED_COLORS = [
  { name: 'Satin Pearl White', value: '#f4f6f7' },
  { name: 'Gloss Black', value: '#111111' },
  { name: 'Matte Military Green', value: '#4b5320' },
  { name: 'Nardo Grey', value: '#797c7e' },
  { name: 'Midnight Blue', value: '#191970' },
  { name: 'Crimson Red', value: '#990000' },
  { name: 'Tangerine Orange', value: '#f28500' },
  { name: 'Plum Crazy Purple', value: '#582157' },
];

export function CarColorVisualizer() {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [color, setColor] = useState<string>('transparent');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setColor('transparent');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setColor('transparent');
    }
  };

  return (
    <div className="bg-card rounded-xl p-8 shadow-2xl mb-16 border border-primary/20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          {t('colorVisualizerTitle') || 'Car Color Visualizer'}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('colorVisualizerDesc') || 'Upload a photo of your car and instantly preview how it looks in our premium wrap colors. Experience the transformation before making a decision.'}
        </p>
      </div>
      
      {!image ? (
        <div 
          className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-primary/50 rounded-xl bg-background/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="bg-primary/10 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-12 h-12 text-primary" />
          </div>
          <p className="text-2xl font-semibold mb-2">Upload your car photo</p>
          <p className="text-muted-foreground text-center">Click to browse or drag and drop an image here</p>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload} 
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="relative rounded-xl overflow-hidden shadow-inner bg-background/50 flex items-center justify-center min-h-[300px]">
              <img 
                src={image} 
                alt="Uploaded car" 
                className="w-full max-h-[600px] object-contain relative z-10" 
              />
              {/* Color overlay with mix-blend-mode */}
              {color !== 'transparent' && (
                <div 
                  className="absolute inset-0 pointer-events-none transition-colors duration-500 z-20"
                  style={{ 
                    backgroundColor: color, 
                    mixBlendMode: 'color',
                    opacity: 0.8
                  }}
                />
              )}
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4 italic">
              Note: This is a basic visualization. Actual wrap results may vary based on lighting and original car color.
            </p>
          </div>
          
          <div className="w-full lg:w-80 flex flex-col gap-6 bg-background/50 p-6 rounded-xl border border-primary/10">
            <h3 className="text-2xl font-bold border-b border-primary/20 pb-4">Select a Color</h3>
            
            <div className="grid grid-cols-4 lg:grid-cols-2 gap-4">
              <button 
                className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${color === 'transparent' ? 'border-primary bg-primary/10' : 'border-transparent hover:border-primary/50 hover:bg-background'}`}
                onClick={() => setColor('transparent')}
                title="Original Color"
              >
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-stripes">
                  <span className="text-xs font-bold text-muted-foreground">ORIG</span>
                </div>
                <span className="text-xs font-medium text-center">Original</span>
              </button>
              
              {SUGGESTED_COLORS.map(c => (
                <button
                  key={c.name}
                  className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${color === c.value ? 'border-primary bg-primary/10 scale-105 shadow-md' : 'border-transparent hover:border-primary/50 hover:bg-background'}`}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                >
                  <div 
                    className="w-10 h-10 rounded-full shadow-sm ring-1 ring-black/10"
                    style={{ backgroundColor: c.value }}
                  />
                  <span className="text-xs font-medium text-center line-clamp-2">{c.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-auto pt-6 border-t border-primary/20">
              <button 
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold flex items-center justify-center gap-2"
                onClick={() => {
                  setImage(null);
                  setColor('transparent');
                }}
              >
                <Upload className="w-4 h-4" />
                Upload New Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
