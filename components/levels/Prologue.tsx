import React, { useState, useEffect } from 'react';

interface PrologueProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

type Stage = 'intro' | 'microscope' | 'treatment' | 'alchemy' | 'healing' | 'anatomy';

// Internal Component: Sheikah Microscope View
const MicroscopeView = ({ type }: { type: 'long' | 'short' }) => (
  <div className="relative w-full max-w-[200px] aspect-square rounded-full border-4 border-cyan-500/50 bg-black overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] group mx-auto cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    
    {/* Scanning Line Animation */}
    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/80 shadow-[0_0_10px_cyan] animate-[scan_2s_linear_infinite] z-20"></div>

    {/* SVG Visuals */}
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-2 z-10">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#065f46" /> 
                <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
        </defs>
        
        {type === 'long' ? (
            // Long Trichomes (Nettle) - Sharp, needle-like
            <g className="origin-bottom transform scale-y-90 translate-y-2">
                <path d="M20 90 L22 20 L24 90" fill="url(#grad1)" stroke="#34d399" strokeWidth="0.5" />
                <path d="M45 90 L48 10 L51 90" fill="url(#grad1)" stroke="#34d399" strokeWidth="0.5" />
                <path d="M75 90 L77 25 L79 90" fill="url(#grad1)" stroke="#34d399" strokeWidth="0.5" />
                {/* Base cells */}
                <path d="M0 90 Q 50 85 100 90 L 100 100 L 0 100 Z" fill="#064e3b" />
            </g>
        ) : (
            // Short Trichomes (Dog) - Dense, short stubble
            <g className="origin-bottom">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x, i) => (
                    <path 
                        key={i} 
                        d={`M${x} 90 L${x+2} ${75 + (i%2)*5} L${x+4} 90`} 
                        fill="url(#grad1)" 
                        stroke="#34d399" 
                        strokeWidth="0.5" 
                    />
                ))}
                {/* Base cells */}
                <path d="M0 90 Q 50 88 100 90 L 100 100 L 0 100 Z" fill="#064e3b" />
            </g>
        )}
    </svg>
    
    {/* HUD Overlay */}
    <div className="absolute top-4 right-4 text-[9px] text-cyan-400 font-mono z-20 bg-black/50 px-1 rounded border border-cyan-500/30">
       MAG: {type === 'long' ? '50x' : '200x'}
    </div>
    <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-emerald-400 font-mono z-20 animate-pulse">
       ANALYZING...
    </div>
  </div>
);

const Prologue: React.FC<PrologueProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer }) => {
  const [stage, setStage] = useState<Stage>('intro');
  const [hp, setHp] = useState(80);
  const [mashCount, setMashCount] = useState(0);
  const [isCrushing, setIsCrushing] = useState(false);

  // Health drain effect
  useEffect(() => {
    if (['intro', 'microscope', 'treatment'].includes(stage)) {
      const interval = setInterval(() => {
        setHp(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Game over check
  useEffect(() => {
    if (hp === 0) {
      onFail("生命力歸零！毒素擴散全身。");
      setHp(80);
      setStage('intro');
    }
  }, [hp, onFail]);

  const handleIntroNext = () => setStage('microscope');

  const handleIdentify = (choice: 'nettle' | 'dog') => {
    if (choice === 'nettle') {
      setStage('treatment');
    } else {
      onFail("鑑定錯誤！這是「咬人狗」。你的傷口是深層刺痛，應該是長刺毛。");
      setHp(prev => Math.max(0, prev - 10));
    }
  };

  const handleTreatment = (item: 'water' | 'urine' | 'alocasia') => {
    if (item === 'alocasia') {
      setStage('alchemy');
    } else if (item === 'water') {
      onFail("無效！清水只能沖洗表面，無法中和注入深層皮下的甲酸毒素。");
      setHp(prev => Math.max(0, prev - 10));
    } else {
      onFail("無效！尿液的酸鹼值不穩定，且不衛生，容易感染。");
      setHp(prev => Math.max(0, prev - 10));
    }
  };

  const handleMash = () => {
    setIsCrushing(true);
    setTimeout(() => setIsCrushing(false), 100);

    if (mashCount < 20) {
      setMashCount(prev => prev + 1);
    }
    if (mashCount >= 19) {
      setStage('healing');
    }
  };

  // Healing animation
  useEffect(() => {
    if (stage === 'healing') {
      const interval = setInterval(() => {
        setHp(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('anatomy'), 1000);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleAnatomy = (part: 'stem' | 'leaf') => {
    if (part === 'leaf') {
      onSaveAnswer("Prologue: Leaf Collected"); 
      onSuccessMsg("採集成功！<br>你已習得原住民的野外急救智慧：<span class='text-emerald-400'>生物鹼中和甲酸</span>。");
      onComplete();
    } else {
      onFail("危險！咬人狗的莖部佈滿了毒刺！");
      setHp(prev => Math.max(0, prev - 20));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-mono text-slate-200">
      {/* HUD Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border-y-2 border-cyan-500/50 p-2 sticky top-0 z-30 shadow-lg backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-red-500 animate-pulse">favorite</span>
          <div className="w-32 h-4 bg-slate-800 skew-x-[-15deg] border border-slate-600 relative overflow-hidden">
            <div className={`h-full transition-all duration-300 ${hp < 30 ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`} style={{ width: `${hp}%` }}></div>
          </div>
          <span className="text-xl font-bold">{Math.floor(hp)}/100</span>
        </div>
        <div className="text-cyan-400 text-xs tracking-widest uppercase border border-cyan-500/30 px-2 py-1 rounded">
          STATUS: <span className="text-white">{stage.toUpperCase()}</span>
        </div>
      </div>

      {stage === 'intro' && (
        <div className="animate-[fadeIn_0.5s_ease-out] text-center space-y-6 pt-10">
          <div className="relative inline-block">
            <span className="material-symbols-outlined text-8xl text-red-500 animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">warning</span>
          </div>
          <h2 className="text-3xl font-bold text-red-400 font-serif">覺醒之森：中毒警報</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            在探索迷霧毒林時，小腿突然傳來一陣劇烈的<span className="text-red-400 font-bold border-b border-red-500">深層刺痛</span>！
            <br/><span className="text-xs text-slate-500 mt-2 block">( HP 持續下降中... )</span>
          </p>
          <button onClick={handleIntroNext} className="px-8 py-3 bg-cyan-900/50 border border-cyan-500 hover:bg-cyan-800 text-cyan-100 rounded transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 mx-auto">
            <span className="material-symbols-outlined">search</span>
            開啟希卡顯微鏡
          </button>
        </div>
      )}

      {stage === 'microscope' && (
        <div className="animate-[slideUp_0.5s_ease-out] space-y-8">
          <div className="text-center">
            <h3 className="text-xl text-cyan-400 font-bold mb-2">微觀鑑識：確認元兇</h3>
            <p className="text-slate-400 text-sm">請觀察傷口特徵：<span className="text-white font-bold">深層刺痛</span>通常來自長刺毛。</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {/* Option A: Nettle */}
            <div onClick={() => handleIdentify('nettle')} className="flex flex-col gap-4 group cursor-pointer">
               <MicroscopeView type="long" />
               <div className="text-center p-4 bg-slate-900 border border-slate-700 rounded-xl group-hover:border-emerald-500 transition-colors">
                  <h4 className="font-bold text-emerald-400 text-lg mb-1">樣本 A：咬人貓</h4>
                  <p className="text-xs text-slate-400">特徵：長刺毛 (針狀)，可刺入真皮層。</p>
               </div>
            </div>

            {/* Option B: Dog */}
            <div onClick={() => handleIdentify('dog')} className="flex flex-col gap-4 group cursor-pointer">
               <MicroscopeView type="short" />
               <div className="text-center p-4 bg-slate-900 border border-slate-700 rounded-xl group-hover:border-emerald-500 transition-colors">
                  <h4 className="font-bold text-emerald-600 text-lg mb-1">樣本 B：咬人狗</h4>
                  <p className="text-xs text-slate-400">特徵：短密刺毛 (絨狀)，僅表層灼熱。</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {stage === 'treatment' && (
        <div className="animate-[slideUp_0.5s_ease-out] space-y-6 text-center">
          <h3 className="text-xl text-cyan-400 font-bold">試煉 I：以毒攻毒</h3>
          <p className="text-slate-300">咬人貓含有<span className="text-red-400 font-bold">甲酸 (酸性)</span>。請選擇中和劑。</p>
          
          <div className="flex gap-4 justify-center mt-8">
            <button onClick={() => handleTreatment('water')} className="p-6 bg-slate-800 border border-slate-600 hover:border-blue-400 hover:bg-blue-900/20 rounded-xl flex flex-col items-center gap-3 w-1/3 transition-all">
              <span className="material-symbols-outlined text-4xl text-blue-400">water_drop</span>
              <span className="font-bold">清水 (pH 7)</span>
            </button>
            <button onClick={() => handleTreatment('alocasia')} className="p-6 bg-slate-800 border-2 border-emerald-600/50 hover:border-emerald-400 hover:bg-emerald-900/20 rounded-xl flex flex-col items-center gap-3 w-1/3 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
              <span className="material-symbols-outlined text-4xl text-emerald-400">psychiatry</span>
              <span className="font-bold">姑婆芋 (鹼性)</span>
            </button>
            <button onClick={() => handleTreatment('urine')} className="p-6 bg-slate-800 border border-slate-600 hover:border-yellow-400 hover:bg-yellow-900/20 rounded-xl flex flex-col items-center gap-3 w-1/3 transition-all">
              <span className="material-symbols-outlined text-4xl text-yellow-400">science</span>
              <span className="font-bold">氨水/尿液</span>
            </button>
          </div>
        </div>
      )}

      {stage === 'alchemy' && (
        <div className="animate-[slideUp_0.5s_ease-out] flex flex-col items-center gap-6">
          <h3 className="text-xl text-emerald-400 font-bold">製藥鍊金：萃取生物鹼</h3>
          <p className="text-sm text-slate-400">快速點擊以搗碎姑婆芋，釋放汁液！</p>
          
          {/* Pestle and Leaf (Mortar) Interaction */}
          <div 
            onClick={handleMash} 
            className="relative w-64 h-64 flex items-center justify-center cursor-pointer group select-none tap-highlight-transparent mt-8"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* The Leaf (Mortar Container) */}
            <div className="absolute bottom-0 w-56 h-48 bg-gradient-to-br from-emerald-600 to-green-900 rounded-[2rem_2rem_4rem_4rem] border-4 border-emerald-950 shadow-2xl flex items-center justify-center overflow-hidden z-10 transform rotate-[-5deg]">
                {/* Leaf Veins Visual */}
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_12px)]"></div>
                <div className="absolute w-1 h-full bg-emerald-950/20 left-1/2 -translate-x-1/2 blur-[1px]"></div>
                <div className="absolute w-full h-1 bg-emerald-950/20 top-1/2 -translate-y-1/2 blur-[1px] rotate-45"></div>
                <div className="absolute w-full h-1 bg-emerald-950/20 top-1/2 -translate-y-1/2 blur-[1px] -rotate-45"></div>

                {/* Juice Filling Progress */}
                <div 
                    className="absolute bottom-0 w-full bg-emerald-400/90 transition-all duration-200 ease-out flex items-end justify-center mix-blend-hard-light"
                    style={{ height: `${(mashCount / 20) * 100}%` }}
                >
                    {/* Bubbles/Pulp */}
                    <div className="w-full h-full opacity-60 bg-[radial-gradient(circle,rgba(255,255,255,0.5)_2px,transparent_3px)] bg-[size:12px_12px] animate-pulse"></div>
                </div>
            </div>
            
            {/* The Stone (Pestle) */}
            <div className={`absolute top-0 right-10 w-32 h-28 bg-stone-500 rounded-[40%_50%_40%_60%] border-b-8 border-stone-700 shadow-xl z-20 flex items-center justify-center transform origin-bottom transition-all duration-100 ease-in-out
                ${isCrushing ? 'translate-y-16 rotate-[20deg] scale-95' : '-translate-y-4 rotate-0'}
            `}>
                {/* Stone Texture */}
                <div className="w-full h-full rounded-[inherit] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] overflow-hidden relative">
                    <div className="absolute top-4 left-6 w-3 h-3 bg-stone-700 rounded-full opacity-30"></div>
                    <div className="absolute bottom-6 right-8 w-5 h-5 bg-stone-700 rounded-full opacity-40"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-stone-300 rounded-full opacity-20"></div>
                </div>
            </div>
            
            {/* Splash Effect */}
            <div className={`absolute bottom-16 z-30 transition-all duration-100 pointer-events-none ${isCrushing ? 'opacity-100 scale-125' : 'opacity-0 scale-50'}`}>
                <div className="w-3 h-3 bg-emerald-300 rounded-full shadow-[0_0_15px_#34d399] absolute -left-4 -top-2"></div>
                <div className="w-2 h-2 bg-emerald-300 rounded-full shadow-[0_0_15px_#34d399] absolute left-6 -top-6"></div>
                <div className="w-2 h-2 bg-emerald-300 rounded-full shadow-[0_0_15px_#34d399] absolute right-0 -top-2"></div>
            </div>
          </div>
          
          <div className="text-emerald-400/80 text-xs animate-pulse font-bold tracking-[0.2em] mt-2">
             點擊搗碎
          </div>

          {/* Progress Bar (Visualizing Concentration) */}
          <div className="w-64 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
             <div className="h-full bg-gradient-to-r from-emerald-800 to-emerald-400 transition-all duration-100" style={{ width: `${(mashCount/20)*100}%` }}></div>
          </div>
        </div>
      )}

      {stage === 'anatomy' && (
        <div className="animate-[slideUp_0.5s_ease-out] space-y-8 text-center">
          <h3 className="text-xl text-orange-400 font-bold">試煉 II：部位的奧秘 (採集)</h3>
          <div className="p-4 bg-orange-900/20 border border-orange-500/50 rounded text-sm text-orange-200 mb-4">
             警告：咬人狗 (Dendrocnide) 的毒刺分布不均。請選擇安全的部位進行採集。
          </div>
          
          <div className="flex gap-6 justify-center">
             <button onClick={() => handleAnatomy('leaf')} className="bg-slate-800 p-8 rounded-xl border-2 border-slate-600 hover:border-emerald-500 hover:bg-slate-700 flex flex-col items-center gap-4 w-40 transition-all group">
                <span className="material-symbols-outlined text-6xl text-emerald-300 group-hover:scale-110 transition-transform">spa</span>
                <span className="font-bold">採集葉片</span>
             </button>
             <button onClick={() => handleAnatomy('stem')} className="bg-slate-800 p-8 rounded-xl border-2 border-slate-600 hover:border-red-500 hover:bg-slate-700 flex flex-col items-center gap-4 w-40 transition-all group">
                <span className="material-symbols-outlined text-6xl text-red-300 group-hover:scale-110 transition-transform">park</span>
                <span className="font-bold">採集莖部</span>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prologue;