
import React, { useState } from 'react';

interface RattanProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

type Phase = 'material' | 'knot' | 'test';
type Age = '0yr' | '2yr' | '5yr';
type Knot = 'parallel' | 'cross' | 'figure8';

const AGES: Record<Age, { name: string; score: number; water: string; strength: string; color: string; desc: string }> = {
    '0yr': { 
        name: '青藤 (0年)', 
        score: 10, 
        water: '80% (High)', 
        strength: '弱', 
        color: 'text-green-400',
        desc: '未成熟，含水量極高，容易腐爛且張力不足。'
    },
    '2yr': { 
        name: '黃藤 (2年)', 
        score: 50, 
        water: '30% (Med)', 
        strength: '中', 
        color: 'text-yellow-400',
        desc: '標準材料。雖然可用，但在極端災厄下可能斷裂。'
    },
    '5yr': { 
        name: '古銅藤 (5年)', 
        score: 100, 
        water: '5% (Low)', 
        strength: '極強', 
        color: 'text-amber-500',
        desc: '神級素材。經過日曬木質化，纖維緊密，耐磨性最強。'
    },
};

const KNOTS: Record<Knot, { name: string; score: number; icon: string; desc: string }> = {
    'parallel': { 
        name: '平結 (Parallel)', 
        score: 10, 
        icon: 'density_large',
        desc: '接觸面積小，摩擦力不足，容易滑動鬆脫。'
    },
    'cross': { 
        name: '十字結 (Cross)', 
        score: 60, 
        icon: 'close',
        desc: '增加垂直方向的摩擦力，結構尚可。'
    },
    'figure8': { 
        name: '八字結 (Figure-8)', 
        score: 90, 
        icon: 'all_inclusive',
        desc: '最大化接觸面積與摩擦力，能有效分散應力。'
    },
};

const Rattan: React.FC<RattanProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer }) => {
  const [phase, setPhase] = useState<Phase>('material');
  const [age, setAge] = useState<Age | null>(null);
  const [knot, setKnot] = useState<Knot | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const startTest = () => {
      if (!age || !knot) return;
      setIsTesting(true);
      
      // Simulate earthquake
      setTimeout(() => {
          setIsTesting(false);
          const total = AGES[age].score + KNOTS[knot].score;
          
          // Require Age=5yr (100) + Knot=Cross(60) or Fig8(90) => Threshold 150
          if (total >= 150) { 
              onSaveAnswer(`Rattan: ${age}, ${knot}`);
              onSuccessMsg("結構穩固！<br>完美的選材 (木質化) 與 綁法 (高摩擦力)，會所屹立不搖。");
              onComplete();
          } else {
              let failReason = "";
              if (AGES[age].score < 100) failReason += "藤材太年輕，強度不足。";
              if (KNOTS[knot].score < 60) failReason += " 綁法太簡單，摩擦力不足導致鬆脫。";
              
              onFail(`結構崩塌！<br>${failReason}`);
              setPhase('material');
              setAge(null);
              setKnot(null);
          }
      }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out] pb-12">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-400 font-serif flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-4xl">handyman</span>
                究極傳說：黃藤之絆
            </h2>
            <p className="text-amber-500/60 text-xs tracking-widest uppercase mt-2">Trial of Ultrahand</p>
        </div>

        {/* Progress Bar (Zelda Style) */}
        <div className="flex justify-center gap-4 mb-4">
            <div className={`h-2 flex-1 rounded-full transition-all ${phase === 'material' ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-slate-700'}`}></div>
            <div className={`h-2 flex-1 rounded-full transition-all ${phase === 'knot' ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-slate-700'}`}></div>
            <div className={`h-2 flex-1 rounded-full transition-all ${phase === 'test' ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-slate-700'}`}></div>
        </div>

        <div className="bg-slate-900 border-4 border-amber-600/30 p-8 rounded-xl min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
             {/* Background Art */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url(https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Calamus_rotang_-_Köhler–s_Medizinal-Pflanzen-024.jpg/480px-Calamus_rotang_-_Köhler–s_Medizinal-Pflanzen-024.jpg)] bg-cover grayscale"></div>

             {phase === 'material' && (
                 <div className="w-full relative z-10 space-y-8 animate-[slideUp_0.3s_ease-out]">
                     <div className="text-center">
                        <h3 className="text-2xl text-white font-bold mb-2">希卡掃描器：素材辨識</h3>
                        <p className="text-slate-400 text-sm">請選擇<span className="text-amber-400 font-bold">木質化程度最高</span>的材料。</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {(Object.keys(AGES) as Age[]).map((k) => (
                             <button
                                key={k}
                                onClick={() => { setAge(k); setPhase('knot'); }}
                                className="relative p-6 bg-slate-800 border-2 border-slate-600 rounded-xl hover:border-amber-500 hover:bg-slate-700 transition-all flex flex-col items-center gap-4 group overflow-hidden"
                             >
                                 <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none`}></div>
                                 <div className={`w-6 h-32 rounded-full border-x-2 shadow-inner group-hover:scale-105 transition-transform ${k==='0yr'?'bg-green-700 border-green-500':k==='2yr'?'bg-yellow-600 border-yellow-400':'bg-[#8B4513] border-[#D2691E]'}`}></div>
                                 
                                 <div className="relative z-10 text-center">
                                    <span className={`font-bold text-lg ${AGES[k].color} block mb-1`}>{AGES[k].name}</span>
                                    <span className="text-[10px] text-slate-300 bg-black/40 px-2 py-1 rounded block">{AGES[k].desc}</span>
                                 </div>
                                 
                                 {/* HUD Info */}
                                 <div className="w-full grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2 font-mono">
                                     <div className="bg-black/30 p-1 rounded text-center">H2O: {AGES[k].water}</div>
                                     <div className="bg-black/30 p-1 rounded text-center">STR: {AGES[k].strength}</div>
                                 </div>
                             </button>
                         ))}
                     </div>
                 </div>
             )}

             {phase === 'knot' && (
                 <div className="w-full relative z-10 space-y-8 animate-[slideUp_0.3s_ease-out]">
                     <div className="text-center">
                        <h3 className="text-2xl text-white font-bold mb-2">究極手：結構連結</h3>
                        <p className="text-slate-400 text-sm">選擇能產生<span className="text-amber-400 font-bold">最大摩擦力</span>的綁法。</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {(Object.keys(KNOTS) as Knot[]).map((k) => (
                             <button
                                key={k}
                                onClick={() => { setKnot(k); setPhase('test'); }}
                                className="p-8 bg-slate-800 border-2 border-slate-600 rounded-xl hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:bg-slate-700 transition-all flex flex-col items-center gap-4 group"
                             >
                                 <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-700 group-hover:border-green-400 transition-colors">
                                    <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-green-400 transition-colors">{KNOTS[k].icon}</span>
                                 </div>
                                 <div className="text-center">
                                    <span className="font-bold text-white text-lg block">{KNOTS[k].name}</span>
                                    <span className="text-xs text-slate-400 mt-2 block">{KNOTS[k].desc}</span>
                                 </div>
                             </button>
                         ))}
                     </div>
                     <div className="text-center">
                        <button onClick={() => setPhase('material')} className="text-slate-500 text-sm hover:text-white underline">重新選擇材料</button>
                     </div>
                 </div>
             )}

             {phase === 'test' && (
                 <div className="w-full relative z-10 space-y-8 text-center animate-[fadeIn_0.5s_ease-out]">
                     <h3 className="text-2xl text-white font-bold mb-6">災厄模擬器：強震測試</h3>
                     
                     <div className="relative w-full max-w-sm mx-auto h-64 bg-slate-800/50 border-b-4 border-slate-600 flex items-center justify-center rounded-t-xl overflow-hidden">
                         
                         {/* The Structure */}
                         <div className={`relative transition-transform duration-100 ${isTesting ? 'animate-[shake_0.5s_infinite]' : ''}`}>
                             {/* Vertical Post */}
                             <div className="w-8 h-48 bg-[#5d4037] mx-auto relative z-0 rounded-sm"></div>
                             {/* Horizontal Beam */}
                             <div className="w-64 h-8 bg-[#5d4037] absolute top-10 left-1/2 -translate-x-1/2 z-10 rounded-sm shadow-lg"></div>
                             
                             {/* Ultrahand Glue Effect */}
                             <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 z-20 opacity-80 mix-blend-screen">
                                 <div className={`w-full h-full ${isTesting ? 'bg-green-400/30' : 'bg-green-500/50'} blur-xl rounded-full animate-pulse`}></div>
                             </div>

                             {/* The Knot Visual */}
                             <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                                 <span className="material-symbols-outlined text-6xl text-amber-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                     {knot && KNOTS[knot].icon}
                                 </span>
                             </div>
                         </div>

                         {/* Stress Particles */}
                         {isTesting && (
                             <>
                                <div className="absolute top-10 left-20 text-red-500 font-bold animate-ping text-xs">STRESS</div>
                                <div className="absolute top-10 right-20 text-red-500 font-bold animate-ping text-xs delay-75">STRESS</div>
                             </>
                         )}
                     </div>

                     <div className="h-16 flex items-center justify-center">
                        {!isTesting ? (
                            <button 
                                onClick={startTest} 
                                className="px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">vibration</span>
                                啟動模擬
                            </button>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-red-400 font-bold font-mono tracking-widest text-xl">SIMULATING...</div>
                                <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 animate-[loading_2.5s_linear]"></div>
                                </div>
                            </div>
                        )}
                     </div>
                 </div>
             )}
        </div>
    </div>
  );
};

export default Rattan;
