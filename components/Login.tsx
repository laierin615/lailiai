import React, { useState } from 'react';
import { ASSETS } from '../constants';

interface LoginProps {
  onStart: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onStart }) => {
  const [inputName, setInputName] = useState('');
  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error' | 'fallback'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  const handleStart = () => {
    if (inputName.trim()) {
      onStart(inputName);
    }
  };

  const handleImageLoad = () => {
    setImgState('loaded');
  };

  const handleImageError = () => {
    if (retryCount === 0) {
      // Try fallback image
      setRetryCount(1);
      // Keep state as loading or switch to error briefly, but here we just retry the src logic
    } else {
      // Both failed, switch to CSS fallback
      setImgState('fallback');
    }
  };

  const currentImageSrc = retryCount === 0 ? ASSETS.login_bg : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Haeckel_Stephoidea.jpg/640px-Haeckel_Stephoidea.jpg";

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center animate-[fadeIn_0.8s_ease-out]">
      <div className="relative w-full max-w-lg p-1 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative bg-slate-900 border border-slate-700 p-8 rounded-xl shadow-2xl text-center overflow-hidden">
          {/* Sheikah Slate Decor */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          {/* Image Container with Fixed Aspect Ratio */}
          <div className="mb-8 relative w-full h-56 rounded-lg border-2 border-cyan-900 bg-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/10 z-0"></div>
            
            {/* Loading Spinner */}
            {imgState === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="material-symbols-outlined text-4xl text-cyan-500/50 animate-spin">data_usage</span>
              </div>
            )}

            {/* CSS Fallback Pattern (Sheikah Eye Abstract) */}
            {imgState === 'fallback' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-50 z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
                <div className="relative w-32 h-32 border-4 border-cyan-500/30 rounded-full flex items-center justify-center animate-[pulse_4s_infinite]">
                   <div className="w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                   <div className="absolute top-0 w-1 h-4 bg-cyan-500/30"></div>
                   <div className="absolute bottom-0 w-1 h-4 bg-cyan-500/30"></div>
                   <div className="absolute left-0 w-4 h-1 bg-cyan-500/30"></div>
                   <div className="absolute right-0 w-4 h-1 bg-cyan-500/30"></div>
                </div>
              </div>
            )}

            {/* Main Image */}
            {imgState !== 'fallback' && (
              <img 
                className={`w-full h-full object-cover relative z-10 sepia-[0.3] transition-opacity duration-700 ease-in-out ${imgState === 'loaded' ? 'opacity-90' : 'opacity-0'}`} 
                src={currentImageSrc}
                onLoad={handleImageLoad}
                onError={handleImageError}
                alt="Sheikah Slate Interface" 
              />
            )}
          </div>

          <h2 className="text-3xl font-bold text-cyan-100 mb-2 tracking-widest font-serif drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">獵人試煉</h2>
          <p className="text-cyan-400/80 italic text-sm font-mono tracking-wider mb-6">
            「正在驗證希卡石板權限...」
          </p>

          <div className="space-y-6">
            <div className="text-left relative">
              <label className="text-[10px] text-cyan-500 uppercase font-bold tracking-[0.2em] absolute -top-3 left-3 bg-slate-900 px-2">登錄名稱</label>
              <input 
                className="w-full bg-slate-800/50 border border-cyan-900/50 text-center text-cyan-100 p-4 rounded-lg mt-1 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono transition-all placeholder:text-slate-600 text-lg shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                placeholder="輸入小隊名稱" 
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
            </div>
            <button 
              className="w-full bg-gradient-to-r from-cyan-900 to-slate-900 hover:from-cyan-800 hover:to-slate-800 border border-cyan-500/30 text-cyan-100 font-bold py-4 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              onClick={handleStart}
              disabled={!inputName.trim()}
            >
              <span className="material-symbols-outlined group-hover:animate-ping text-sm">fingerprint</span> 
              <span className="tracking-[0.2em]">啟動希卡石板</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;