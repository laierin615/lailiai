import React, { useState, useEffect } from 'react';

interface SheikahImageProps {
  src: string;
  alt: string;
  className?: string;
  overlayStyle?: boolean; // If true, adds a sepia/overlay effect
}

const SheikahImage: React.FC<SheikahImageProps> = ({ src, alt, className = "", overlayStyle = true }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  // Reset status if src changes
  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {/* Loading State */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-800/50 backdrop-blur-sm">
          <span className="material-symbols-outlined text-4xl text-cyan-500/50 animate-spin">data_usage</span>
        </div>
      )}

      {/* Fallback / Error State (Pure CSS Sheikah Pattern) */}
      {(status === 'error' || status === 'loading') && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30 z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
          <div className="relative w-24 h-24 border-2 border-cyan-500/30 rounded-full flex items-center justify-center animate-[pulse_4s_infinite]">
             <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
             <div className="absolute top-0 w-px h-full bg-cyan-500/20"></div>
             <div className="absolute left-0 w-full h-px bg-cyan-500/20"></div>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img 
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out relative z-20
          ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}
          ${overlayStyle ? 'sepia-[0.3] hover:sepia-0' : ''}
        `}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
      
      {/* Overlay Decoration */}
      {overlayStyle && (
        <div className="absolute inset-0 border border-white/10 pointer-events-none z-30 rounded-[inherit]"></div>
      )}
    </div>
  );
};

export default SheikahImage;