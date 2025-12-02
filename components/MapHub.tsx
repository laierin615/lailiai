
import React from 'react';
import { GameState, LevelId } from '../types';

interface MapHubProps {
  gameState: GameState;
  onEnterLevel: (id: LevelId) => void;
  onOpenGuide: () => void;
}

// Internal Component for the Shrine Node
const ShrineNode = ({ 
  title, 
  subtitle, 
  icon, 
  state, 
  onClick, 
  position,
  colorScheme = 'cyan' // New prop for different colors
}: { 
  id: string, 
  title: string, 
  subtitle: string, 
  icon: string, 
  state: 'locked' | 'available' | 'completed', 
  onClick: () => void,
  position?: string,
  colorScheme?: 'cyan' | 'purple' | 'amber' // Added Amber for Rattan
}) => {
  
  // Visual Styles based on state and color scheme
  const isPurple = colorScheme === 'purple';
  const isAmber = colorScheme === 'amber';
  
  const getBorderColor = () => {
      if (state === 'completed') return 'border-amber-500'; // Completed is always gold
      if (state === 'locked') return 'border-slate-700';
      if (isPurple) return 'border-purple-500';
      if (isAmber) return 'border-amber-600';
      return 'border-cyan-500';
  };

  const getTextColor = () => {
      if (state === 'completed') return 'text-amber-100';
      if (state === 'locked') return 'text-slate-600';
      if (isPurple) return 'text-purple-100';
      if (isAmber) return 'text-amber-100';
      return 'text-cyan-100';
  };

  const getIconColor = () => {
      if (state === 'completed') return 'text-amber-500';
      if (state === 'locked') return 'text-slate-600';
      if (isPurple) return 'text-purple-400';
      if (isAmber) return 'text-amber-500';
      return 'text-cyan-400';
  };
  
  const styles = {
    locked: {
      bg: 'bg-slate-900',
      glow: '',
      cursor: 'cursor-not-allowed opacity-60'
    },
    available: {
      bg: 'bg-slate-900',
      glow: isPurple 
        ? 'shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-pulse' 
        : isAmber 
            ? 'shadow-[0_0_15px_rgba(217,119,6,0.6)] animate-pulse'
            : 'shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse',
      cursor: 'cursor-pointer hover:bg-slate-800 hover:scale-105'
    },
    completed: {
      bg: 'bg-slate-900',
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]',
      cursor: 'cursor-pointer hover:bg-amber-900/20'
    }
  };

  const currentStyle = styles[state];
  const borderColor = getBorderColor();
  const textColor = getTextColor();
  const iconColor = getIconColor();

  return (
    <button
      onClick={state !== 'locked' ? onClick : undefined}
      className={`relative group flex flex-col items-center gap-2 transition-all duration-300 transform ${currentStyle.cursor} ${position || ''} p-2 z-20`}
    >
      {/* Shrine Icon Shape (Diamond rotated) */}
      <div className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-500`}>
         {/* Outer Rotating Ring (Decoration) */}
         {state === 'available' && (
            <div className={`absolute inset-0 border rounded-full animate-[spin_10s_linear_infinite] ${isPurple ? 'border-purple-500/30' : isAmber ? 'border-amber-500/30' : 'border-cyan-500/30'}`}></div>
         )}
         
         {/* Main Shape */}
         <div className={`w-12 h-12 md:w-14 md:h-14 transform rotate-45 border-2 ${borderColor} ${currentStyle.bg} ${currentStyle.glow} flex items-center justify-center z-10 transition-colors`}>
            {/* Inner Icon (Counter-rotated to be straight) */}
            <div className="transform -rotate-45">
              {state === 'completed' ? (
                 <span className="material-symbols-outlined text-3xl md:text-4xl text-amber-500 font-bold">check</span>
              ) : (
                 <span className={`material-symbols-outlined text-3xl md:text-4xl ${iconColor}`}>{icon}</span>
              )}
            </div>
         </div>

         {/* Connector Dot (Top/Bottom) */}
         <div className={`absolute top-0 w-1 h-3 ${state === 'locked' ? 'bg-slate-700' : (isPurple ? 'bg-purple-500' : isAmber ? 'bg-amber-600' : 'bg-cyan-500')} -translate-y-full`}></div>
         <div className={`absolute bottom-0 w-1 h-3 ${state === 'locked' ? 'bg-slate-700' : (isPurple ? 'bg-purple-500' : isAmber ? 'bg-amber-600' : 'bg-cyan-500')} translate-y-full`}></div>
      </div>

      {/* Label Box */}
      <div className={`mt-2 px-3 py-1 bg-black/60 border ${borderColor} backdrop-blur-sm rounded text-center min-w-[120px]`}>
        <div className={`text-xs md:text-sm font-bold font-serif ${textColor}`}>{title}</div>
        <div className="text-[10px] tracking-widest text-slate-500 font-serif mt-0.5">{subtitle}</div>
      </div>
    </button>
  );
};

const MapHub: React.FC<MapHubProps> = ({ gameState, onEnterLevel, onOpenGuide }) => {
  // Determine unlock status (For testing: ALL UNLOCKED)
  const isTaxonomyUnlocked = true; // gameState.prologue;
  const isDyeUnlocked = true; // gameState.taxonomy;
  const isTrapUnlocked = true; // gameState.dye;
  const isRiverUnlocked = true; // gameState.trap;
  const isFinalUnlocked = true; // gameState.river;
  
  // Side Quest Logic: Post-game content (Unlocked for testing)
  const isKubaUnlocked = true; // gameState.final;
  const isRattanUnlocked = true; // gameState.final;

  return (
    <section className="relative min-h-[90vh] pb-20 overflow-hidden bg-slate-950">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Constellation Grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Sheikah Eye Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-900/30 rounded-full animate-[spin_120s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-900/30 rounded-full animate-[spin_90s_linear_infinite_reverse]"></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_100%)]"></div>
      </div>

      {/* --- UI Overlay --- */}
      <div className="relative z-10 pt-4 px-4">
        
        {/* Header HUD */}
        <div className="text-center mb-12 relative">
          <div className="inline-block border-x-2 border-cyan-500/50 px-8 py-2 bg-black/40 backdrop-blur">
             <h2 className="text-2xl md:text-3xl font-bold text-cyan-100 font-serif tracking-widest">希卡塔：試煉之境</h2>
             <div className="h-[1px] w-full bg-cyan-500/50 my-1"></div>
             <p className="text-[10px] text-cyan-400 font-mono tracking-[0.3em]">古代科學解密程序：同步中</p>
          </div>
          
          {/* Guide Button */}
          <button 
              onClick={onOpenGuide}
              className="absolute top-2 left-0 md:left-10 flex items-center gap-2 text-amber-400 hover:text-white transition-all group"
          >
              <div className="w-8 h-8 rounded border border-amber-500 flex items-center justify-center bg-amber-900/20 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                 <span className="material-symbols-outlined text-sm">auto_stories</span>
              </div>
              <span className="text-xs font-bold tracking-widest hidden md:inline-block">活動攻略</span>
          </button>
        </div>

        {/* --- MAP NODES CONTAINER --- */}
        <div className="max-w-4xl mx-auto relative flex flex-col items-center gap-12 md:gap-16">
          
          {/* 1. START: Prologue */}
          <div className="relative z-10">
             <ShrineNode 
               id="prologue"
               title="覺醒之森"
               subtitle="生存序章"
               icon="medical_services"
               state={gameState.prologue ? 'completed' : 'available'}
               onClick={() => onEnterLevel('prologue')}
             />
          </div>

          {/* PATH: Prologue -> Taxonomy */}
          <div className={`absolute top-[80px] h-[100px] w-[2px] ${gameState.prologue ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-slate-800'} transition-all duration-1000`}></div>

          {/* 2. LEVEL 1: Taxonomy */}
          <div className="relative z-10 mt-[20px]">
             <ShrineNode 
               id="taxonomy"
               title="初始台地"
               subtitle="分類試煉"
               icon="forest"
               state={gameState.taxonomy ? 'completed' : (isTaxonomyUnlocked ? 'available' : 'locked')}
               onClick={() => onEnterLevel('taxonomy')}
             />
          </div>

          {/* --- SEQUENTIAL PATH SYSTEM (Main Quest) --- */}
          {/* Stem from Taxonomy */}
          <div className={`absolute top-[220px] left-1/2 -translate-x-1/2 h-[20px] w-[2px] ${isDyeUnlocked ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-slate-800'} transition-all duration-1000`}></div>
          
          {/* Path to Dye (Left) */}
          <div className={`absolute top-[240px] right-1/2 w-[140px] md:w-[200px] h-[2px] ${isDyeUnlocked ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-slate-800'} transition-all duration-1000 origin-right`}></div>
          <div className={`absolute top-[240px] right-[calc(50%+140px)] md:right-[calc(50%+200px)] w-[2px] h-[80px] ${isDyeUnlocked ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-slate-800'} transition-all duration-1000`}></div>

          {/* Path Dye -> Trap (Left to Center) */}
          <div className={`absolute top-[360px] left-[calc(50%-140px)] md:left-[calc(50%-200px)] w-[140px] md:w-[200px] h-[2px] ${isTrapUnlocked ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-slate-800'} transition-all duration-1000 origin-left z-0`}></div>

          {/* Path Trap -> River (Center to Right) */}
          <div className={`absolute top-[360px] left-[50%] w-[140px] md:w-[200px] h-[2px] ${isRiverUnlocked ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-slate-800'} transition-all duration-1000 origin-left z-0`}></div>

          {/* Path River -> Final (Right to Center Bottom) */}
          <div className={`absolute top-[400px] left-[calc(50%+140px)] md:left-[calc(50%+200px)] w-[2px] h-[60px] ${isFinalUnlocked ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-slate-800'} transition-all duration-1000`}></div>
          <div className={`absolute top-[460px] left-[50%] w-[140px] md:w-[200px] h-[2px] ${isFinalUnlocked ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-slate-800'} transition-all duration-1000`}></div>
          <div className={`absolute top-[460px] left-1/2 -translate-x-1/2 w-[2px] h-[40px] ${isFinalUnlocked ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-slate-800'} transition-all duration-1000`}></div>


          {/* 3. TRIALS: Dye -> Trap -> River (Sequential Order) */}
          <div className="relative z-10 grid grid-cols-3 gap-4 md:gap-20 mt-[30px]">
             {/* 1. Dye (Earth Temple) */}
             <ShrineNode 
               id="dye"
               title="大地神殿"
               subtitle="化學反應"
               icon="palette"
               state={gameState.dye ? 'completed' : (isDyeUnlocked ? 'available' : 'locked')}
               onClick={() => onEnterLevel('dye')}
             />
             
             {/* 2. Trap (Trial of Power) */}
             <ShrineNode 
               id="trap"
               title="力之試煉"
               subtitle="力學構造"
               icon="hardware"
               state={gameState.trap ? 'completed' : (isTrapUnlocked ? 'available' : 'locked')}
               onClick={() => onEnterLevel('trap')}
             />
             
             {/* 3. River (Trial of Water) */}
             <ShrineNode 
               id="river"
               title="水之試煉"
               subtitle="量化驗證"
               icon="water_drop"
               state={gameState.river ? 'completed' : (isRiverUnlocked ? 'available' : 'locked')}
               onClick={() => onEnterLevel('river')}
             />
          </div>

          {/* 4. FINAL BOSS */}
          <div className="relative z-10 mt-[40px] md:mt-[60px] mb-2">
             <button
                onClick={() => isFinalUnlocked && onEnterLevel('final')}
                disabled={!isFinalUnlocked}
                className={`relative group w-full max-w-sm transition-all duration-500 ${!isFinalUnlocked ? 'opacity-50 grayscale cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-105'}`}
             >
                {/* Boss Node Visual */}
                <div className={`relative w-64 h-24 md:h-32 bg-slate-900 border-2 ${isFinalUnlocked ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse' : 'border-slate-700'} mx-auto flex items-center justify-center overflow-hidden`}>
                   {/* Background Image */}
                   <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Torch_bearer_MET_176274.jpg/640px-Torch_bearer_MET_176274.jpg')] bg-cover opacity-20 mix-blend-overlay"></div>
                   
                   {/* Sheikah Tech Lines */}
                   <div className="absolute inset-0 border-t border-b border-transparent">
                      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${isFinalUnlocked ? 'border-amber-500' : 'border-slate-600'}`}></div>
                      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${isFinalUnlocked ? 'border-amber-500' : 'border-slate-600'}`}></div>
                      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${isFinalUnlocked ? 'border-amber-500' : 'border-slate-600'}`}></div>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${isFinalUnlocked ? 'border-amber-500' : 'border-slate-600'}`}></div>
                   </div>

                   <div className="relative z-10 flex flex-col items-center">
                      <span className={`material-symbols-outlined text-4xl mb-1 ${isFinalUnlocked ? 'text-amber-400 animate-bounce' : 'text-slate-600'}`}>lock_open</span>
                      <h3 className={`text-xl font-bold font-serif ${isFinalUnlocked ? 'text-amber-100' : 'text-slate-500'}`}>終焉之谷：傳承之火</h3>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-1">最終試煉</p>
                   </div>
                </div>
             </button>
          </div>

          {/* PATH: Final -> Extras */}
          <div className={`relative z-0 h-[60px] w-[2px] ${isKubaUnlocked ? 'bg-purple-500 shadow-[0_0_10px_purple]' : 'bg-slate-800'} transition-all duration-1000`}></div>

          {/* 5. SIDE LEVELS (Branching) */}
          <div className="relative z-10 mb-10 flex gap-8">
              <ShrineNode 
                id="kuba"
                title="庫巴的試煉"
                subtitle="番外：風雨守護"
                icon="roofing"
                state={gameState.kuba ? 'completed' : (isKubaUnlocked ? 'available' : 'locked')}
                onClick={() => onEnterLevel('kuba')}
                colorScheme="purple"
              />

              <ShrineNode 
                id="rattan"
                title="究極傳說"
                subtitle="番外：黃藤之絆"
                icon="handyman"
                state={gameState.rattan ? 'completed' : (isRattanUnlocked ? 'available' : 'locked')}
                onClick={() => onEnterLevel('rattan')}
                colorScheme="amber"
              />
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="fixed bottom-4 left-4 text-[10px] text-cyan-900 font-mono hidden md:block">
           希卡石板 Ver 1.0.0 <br/>
           系統運作正常
        </div>
        <div className="fixed bottom-4 right-4 text-[10px] text-cyan-900 font-mono hidden md:block text-right">
           當前座標：<br/>
           -0128, 0054, 0921
        </div>
      </div>
    </section>
  );
};

export default MapHub;
