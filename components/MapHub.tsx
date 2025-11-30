
import React from 'react';
import { GameState, LevelId } from '../types';
import { ASSETS } from '../constants';

interface MapHubProps {
  gameState: GameState;
  onEnterLevel: (id: LevelId) => void;
  onOpenGuide: () => void;
}

const LEVELS: { id: LevelId; title: string; subtitle: string; icon: string; color: string; border: string; bg: string }[] = [
  { id: 'trap', title: '力之試煉：重力的制裁', subtitle: '力學 (Trap)', icon: 'hardware', color: 'text-orange-400', border: 'hover:border-orange-500', bg: 'bg-orange-900/50' },
  { id: 'pharmacy', title: '智慧之泉：看不見的流動', subtitle: '變因 (Pharmacy)', icon: 'science', color: 'text-purple-400', border: 'hover:border-purple-500', bg: 'bg-purple-900/50' },
  // Granary moved to Level 1
  { id: 'dye', title: '大地神殿：色彩的契約', subtitle: '化學 (Dye)', icon: 'palette', color: 'text-pink-400', border: 'hover:border-pink-500', bg: 'bg-pink-900/50' },
  { id: 'river', title: '水之試煉：泡沫的幻影', subtitle: '測量 (River)', icon: 'water_drop', color: 'text-cyan-400', border: 'hover:border-cyan-500', bg: 'bg-cyan-900/50' },
];

const MapHub: React.FC<MapHubProps> = ({ gameState, onEnterLevel, onOpenGuide }) => {
  // 測試模式：強制視為已解鎖，但不改變 gameState 的紀錄
  const isFinalUnlocked = true; 
  // const isPlateauUnlocked = true;

  return (
    <section className="animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mb-10 relative">
        <h2 className="text-3xl font-bold text-white mb-2 font-serif">希卡石板：變因地圖</h2>
        <p className="text-slate-400">解開試煉，找回失落的科學</p>
        
        {/* Adventure Guide Button */}
        <button 
            onClick={onOpenGuide}
            className="absolute top-0 right-0 hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors bg-amber-900/30 px-4 py-2 rounded-full border border-amber-600/50 hover:border-amber-500"
        >
            <span className="material-symbols-outlined text-lg">auto_stories</span>
            <span className="text-xs font-bold tracking-widest">冒險筆記</span>
        </button>
        {/* Mobile version centered below */}
        <button 
            onClick={onOpenGuide}
            className="md:hidden mt-4 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors bg-amber-900/30 px-4 py-2 rounded-full border border-amber-600/50 hover:border-amber-500"
        >
            <span className="material-symbols-outlined text-lg">auto_stories</span>
            <span className="text-xs font-bold tracking-widest">冒險筆記 (攻略)</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Prologue Section (Top) */}
        <div className="flex justify-center">
            <button
                onClick={() => onEnterLevel('prologue')}
                className={`w-full md:w-2/3 border-2 p-4 rounded-xl flex items-center justify-between group relative overflow-hidden transition-all duration-300
                 ${gameState.prologue ? 'bg-slate-800 border-cyan-900' : 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse'}
                `}
            >
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500">
                        <span className="material-symbols-outlined text-cyan-400">medical_services</span>
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-cyan-200">覺醒之森：波送弗依的救援</h3>
                        <p className="text-xs text-cyan-500 uppercase tracking-widest">生存教學試煉</p>
                    </div>
                </div>
                {gameState.prologue && <span className="material-symbols-outlined text-emerald-400 relative z-10">check_circle</span>}
                {!gameState.prologue && <span className="text-xs text-cyan-400 animate-bounce relative z-10">由此開始</span>}
            </button>
        </div>

        {/* Level 1: Initial Plateau (Taxonomy) - Forced Unlock for Testing */}
        <div className={`transition-all duration-500 opacity-100`}>
            <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-4 text-center border-b border-slate-700 pb-2">初始台地</h3>
            <button
                onClick={() => onEnterLevel('taxonomy')}
                className={`w-full bg-slate-800 border border-slate-600 p-6 rounded-xl flex flex-col items-center gap-3 hover:border-emerald-500 transition-all relative
                    ${gameState.taxonomy ? 'border-emerald-900' : ''}
                `}
            >
                 <div className="w-16 h-16 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-500 mb-2">
                    <span className="material-symbols-outlined text-emerald-400 text-3xl">forest</span>
                 </div>
                 <h3 className="font-bold text-white text-lg">初始台地：靈感的狩獵</h3>
                 <p className="text-xs text-slate-400">包含：獵人的分類學、會呼吸的穀倉、研究主題設定</p>
                 {gameState.taxonomy && <div className="absolute top-4 right-4 text-emerald-400"><span className="material-symbols-outlined">check_circle</span></div>}
            </button>
        </div>

        {/* Other Levels - Forced Unlock for Testing */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 opacity-100`}>
          <h3 className="col-span-full text-slate-500 text-xs uppercase tracking-widest text-center border-b border-slate-700 pb-2">海拉魯大地的試煉</h3>
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onEnterLevel(level.id)}
              className={`map-node bg-slate-800 border border-slate-600 p-4 rounded-xl flex items-center gap-4 group relative overflow-hidden transition-all duration-300 ${level.border}`}
            >
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border border-slate-500/50 ${level.bg}`}>
                <span className={`material-symbols-outlined ${level.color}`}>{level.icon}</span>
              </div>
              <div className="relative z-10 text-left">
                <h3 className="font-bold text-slate-200 text-sm">{level.title}</h3>
                <p className={`text-[9px] uppercase tracking-wide ${level.color.replace('text-', 'text-opacity-80 text-')}`}>{level.subtitle}</p>
              </div>
              {gameState[level.id] && (
                <div className="absolute top-4 right-4 text-emerald-400">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Final Level - Forced Unlock for Testing */}
        <button
          onClick={() => onEnterLevel('final')}
          disabled={false}
          className={`w-full border p-6 rounded-xl flex flex-col items-center gap-3 relative overflow-hidden transition-all duration-500
            bg-amber-900/40 border-amber-500 cursor-pointer animate-pulse hover:animate-none
          `}
        >
          <div className="absolute inset-0 bg-cover opacity-10" style={{backgroundImage: `url(${ASSETS.final.torch})`}}></div>
          <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-slate-600 bg-amber-900/80 border-amber-500`}>
            <span className={`material-symbols-outlined text-3xl text-amber-400`}>
              lock_open
            </span>
          </div>
          <div className="relative z-10 text-center">
            <h3 className={`font-bold text-xl text-amber-400`}>終焉之谷：傳承之火</h3>
            <p className="text-xs text-slate-600 uppercase tracking-wide mt-1">需完成所有關卡 (測試模式開啟)</p>
          </div>
        </button>
      </div>
    </section>
  );
};

export default MapHub;
