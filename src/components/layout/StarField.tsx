// import { useEffect, useRef } from 'react';

export function StarField() {
  // A simple static starfield for MVP using CSS radial gradients could be better, 
  // but let's try a lightweight SVG approach or just simple dots.
  // For now, let's use a CSS pattern.

  return (
    <div className="fixed inset-0 -z-50 bg-space-black overflow-hidden pointer-events-none">
       {/* Deep Space Gradient */}
       <div className="absolute inset-0 bg-linear-to-b from-space-black via-[#0f0f16] to-[#151520]" />
       
       {/* Stars - Simulated with CSS dots */}
       <div className="absolute inset-0 opacity-50" 
            style={{ 
              backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} 
       />
       <div className="absolute inset-0 opacity-30 animate-pulse" 
            style={{ 
              backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', 
              backgroundSize: '90px 90px',
              backgroundPosition: '20px 20px'
            }} 
       />
    </div>
  );
}
