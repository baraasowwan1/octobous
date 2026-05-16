import React, { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import * as imgly from '@imgly/background-removal';

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
  const [carMaskUrl, setCarMaskUrl] = useState<string | null>(null);
  const [color, setColor] = useState<string>('transparent');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setImage(URL.createObjectURL(file));
    setCarMaskUrl(null);
    setColor('transparent');
    
    try {
      const imglyRemoveBackground = (imgly as any).default || (imgly as any).removeBackground || imgly;
      const imageBlob = typeof imglyRemoveBackground === 'function' 
        ? await imglyRemoveBackground(file)
        : await (imgly as any)(file);
      const url = URL.createObjectURL(imageBlob);
      setCarMaskUrl(url);
    } catch (err) {
      console.error("Background removal failed:", err);
      setErrorMsg("Failed to isolate the car. Basic tinting will apply.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
    if (e.target) {
        e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleReset = () => {
    setImage(null);
    setCarMaskUrl(null);
    setColor('transparent');
    setErrorMsg(null);
  };

  // The Magic: Pixel-perfect Canvas Coloring
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsRendering(true);

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // If original color selected or no mask ready, just show the image
      if (color === 'transparent' || !carMaskUrl) {
        setIsRendering(false);
        return;
      }

      const mask = new Image();
      mask.onload = () => {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
        if (!maskCtx) return;
        maskCtx.drawImage(mask, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height).data;

        const tr = parseInt(color.slice(1,3), 16) / 255;
        const tg = parseInt(color.slice(3,5), 16) / 255;
        const tb = parseInt(color.slice(5,7), 16) / 255;

        // Photoshop-style overlay math
        const overlay = (base: number, blend: number) => base < 0.5 ? 2 * base * blend : 1 - 2 * (1 - base) * (1 - blend);

        for (let i = 0; i < data.length; i += 4) {
          const maskAlpha = maskData[i + 3];
          
          // Only process pixels inside the car mask
          if (maskAlpha > 50) {
            const r = data[i] / 255;
            const g = data[i+1] / 255;
            const b = data[i+2] / 255;

            // Calculate perceptual brightness (luminance)
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            // SMART MASKING: Prevent tires and windows from taking color
            // If pixel is very dark (< 0.08 luminance), don't color it (tires/deep shadows)
            // Ramp up the color strength so midtones (body paint) take full color
            let strength = 0;
            if (lum > 0.25) strength = 1; // Full color for paint
            else if (lum > 0.08) strength = (lum - 0.08) / 0.17; // Smooth transition for shadows
            
            if (strength > 0) {
              // Apply overlay mode (preserves highlights/gloss naturally)
              const overR = overlay(r, tr);
              const overG = overlay(g, tg);
              const overB = overlay(b, tb);
              
              // Apply multiply mode (adds depth/richness)
              const multR = r * tr;
              const multG = g * tg;
              const multB = b * tb;

              // Blend the two modes for hyper-realism
              const finalR = overR * 0.7 + multR * 0.3;
              const finalG = overG * 0.7 + multG * 0.3;
              const finalB = overB * 0.7 + multB * 0.3;

              // Apply to pixel array with our calculated strength mask
              data[i] = (r + (finalR - r) * strength) * 255;
              data[i+1] = (g + (finalG - g) * strength) * 255;
              data[i+2] = (b + (finalB - b) * strength) * 255;
            }
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        setIsRendering(false);
      };
      mask.src = carMaskUrl;
    };
    img.src = image;
  }, [image, carMaskUrl, color]);

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
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden shadow-inner bg-background/50 flex items-center justify-center min-h-[300px]">
              {(isProcessing || isRendering) && (
                <div className="absolute inset-0 z-30 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-lg font-medium animate-pulse">
                    {isProcessing ? 'Analyzing car shape with AI...' : 'Applying realistic wrap...'}
                  </p>
                </div>
              )}
              
              <canvas 
                ref={canvasRef}
                className="w-full max-h-[600px] object-contain relative z-10" 
              />
            </div>
            
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}
            
            <p className="text-sm text-center text-muted-foreground italic">
              Note: This visualization isolates the body paint by mapping shadows to protect windows and tires. Actual wrap results may vary.
            </p>
          </div>
          
          <div className="w-full lg:w-80 flex flex-col gap-6 bg-background/50 p-6 rounded-xl border border-primary/10">
            <h3 className="text-2xl font-bold border-b border-primary/20 pb-4">Select a Color</h3>
            
            <div className="grid grid-cols-4 lg:grid-cols-2 gap-4">
              <button 
                disabled={isProcessing}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${color === 'transparent' ? 'border-primary bg-primary/10' : 'border-transparent hover:border-primary/50 hover:bg-background'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  disabled={isProcessing}
                  className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${color === c.value ? 'border-primary bg-primary/10 scale-105 shadow-md' : 'border-transparent hover:border-primary/50 hover:bg-background'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                onClick={handleReset}
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
