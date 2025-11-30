
import React, { useState } from 'react';

interface RiverProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

type MaterialType = 'water' | 'masa' | 'qqmi';
type Phase = 'intro' | 'select' | 'tension_test' | 'emulsion_test' | 'report' | 'quiz';

interface MaterialData {
  id: MaterialType;
  name: string;
  sub: string;
  foam: string;
  tensionScore: number; // Max paperclips supported (Lower is better cleaning/penetration)
  cleanScore: number; // Oil removal percentage
  desc: string;
}

const MATERIALS: Record<MaterialType, MaterialData> = {
  water: {
    id: 'water',
    name: '清水',
    sub: 'Control Group',
    foam: '無 (None)',
    tensionScore: 10, // High tension, supports many
    cleanScore: 5,
    desc: '基準對照組。表面張力高，水分子緊抓彼此，無法滲透油汙。'
  },
  masa: {
    id: 'masa',
    name: 'Masa (無患子)',
    sub: 'Soapberry',
    foam: '多 (High)',
    tensionScore: 4,
    cleanScore: 85,
    desc: '傳統清潔霸主。皂苷含量高，乳化效果顯著。'
  },
  qqmi: {
    id: 'qqmi',
    name: "Qqmi' (合歡)",
    sub: 'Acacia',
    foam: '少 (Low)',
    tensionScore: 3, // Very low tension, sinks fast
    cleanScore: 92,
    desc: '泰雅族的去油秘方。雖然泡泡少，但在張力破壞與去油測試中表現驚人。'
  }
};

const River: React.FC<RiverProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedMat, setSelectedMat] = useState<MaterialType>('water');
  const [labData, setLabData] = useState<Record<MaterialType, boolean>>({ water: false, masa: false, qqmi: false });
  
  // Animation States
  const [clips, setClips] = useState<boolean[]>(Array(10).fill(true)); // true = floating
  const [oilOpacity, setOilOpacity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const startExperiment = (mat: MaterialType) => {
    setSelectedMat(mat);
    setPhase('tension_test');
    // Reset visualizations
    setClips(Array(10).fill(true));
    setOilOpacity(1);
  };

  const runTensionTest = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const target = MATERIALS[selectedMat].tensionScore;
    // Animate clips sinking one by one or in groups
    const interval = setInterval(() => {
      setClips(prev => {
        const floatingCount = prev.filter(c => c).length;
        if (floatingCount <= target) {
          clearInterval(interval);
          setIsAnimating(false);
          setTimeout(() => setPhase('emulsion_test'), 1500);
          return prev;
        }
        // Sink one randomly
        const newClips = [...prev];
        const floatingIndices = newClips.map((c, i) => c ? i : -1).filter(i => i !== -1);
        if (floatingIndices.length > 0) {
            newClips[floatingIndices[0]] = false; 
        }
        return newClips;
      });
    }, 200);
  };

  const runEmulsionTest = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const targetOpacity = 1 - (MATERIALS[selectedMat].cleanScore / 100);
    setOilOpacity(targetOpacity);

    setTimeout(() => {
        setIsAnimating(false);
        // Save Data
        setLabData(prev => ({ ...prev, [selectedMat]: true }));
        setTimeout(() => setPhase('report'), 1000);
    }, 1500);
  };

  const checkQuiz = (ans: boolean) => {
      if(ans) {
          onSaveAnswer("Correct: Quantitative Analysis");
          onSuccessMsg("數據解讀正確！<br>你成功利用量化數據打破了「泡泡迷思」，並找出了最強的淨化配方。");
          onComplete();
      } else {
          onFail("觀念錯誤。泡泡只是表面現象，去油率與張力數據才是科學證據。");
      }
  };

  const isDataSufficient = labData.water && (labData.masa || labData.qqmi);

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-400 font-serif tracking-widest flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl">science</span>
            水之試煉：泡沫的幻影
        </h2>
        <p className="text-cyan-500/60 text-xs uppercase tracking-[0.3em] mt-2">Sheikah Lab: Phytosoap Analysis</p>
      </div>

      {/* PHASE 0: INTRO */}
      {phase === 'intro' && (
          <div className="bg-slate-900 border border-cyan-500/50 p-8 rounded-xl text-center space-y-6 shadow-lg">
              <div className="flex justify-center mb-4">
                  <span className="material-symbols-outlined text-6xl text-purple-500 animate-pulse">water_ec</span>
              </div>
              <h3 className="text-xl font-bold text-white">任務：淨化卓蘭溪</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                  災厄的油汙 (Malice Sludge) 汙染了水源。長老交給你兩種傳說植物：<b>Masa</b> 與 <b>Qqmi'</b>。<br/>
                  有人說「泡泡多的才乾淨」，有人說「祖傳的才有效」。<br/>
                  身為希卡科學家，請用<b>「量化實驗」</b>找出真相。
              </p>
              <button onClick={() => setPhase('select')} className="px-8 py-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded shadow-lg transition-all">
                  進入實驗室
              </button>
          </div>
      )}

      {/* PHASE 1: SELECT MATERIAL */}
      {phase === 'select' && (
          <div className="space-y-6">
              <div className="text-center text-slate-400 text-sm">請選擇萃取液進行分析 (需包含對照組)</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(MATERIALS) as MaterialType[]).map(key => (
                      <button 
                        key={key}
                        onClick={() => startExperiment(key)}
                        className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 relative overflow-hidden group
                            ${key === 'water' ? 'border-slate-600 bg-slate-800 hover:border-slate-400' : 
                              key === 'masa' ? 'border-amber-600 bg-amber-900/20 hover:border-amber-500' : 
                              'border-emerald-600 bg-emerald-900/20 hover:border-emerald-500'}
                        `}
                      >
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center border shadow-lg
                             ${key === 'water' ? 'bg-blue-500/20 border-blue-400 text-blue-400' : 
                               key === 'masa' ? 'bg-amber-500/20 border-amber-400 text-amber-400' : 
                               'bg-emerald-500/20 border-emerald-400 text-emerald-400'}
                          `}>
                              <span className="material-symbols-outlined text-3xl">
                                  {key === 'water' ? 'water_drop' : key === 'masa' ? 'soap' : 'grass'}
                              </span>
                          </div>
                          <div className="text-center relative z-10">
                              <div className="font-bold text-lg text-white">{MATERIALS[key].name}</div>
                              <div className="text-[10px] uppercase tracking-widest text-slate-400">{MATERIALS[key].sub}</div>
                          </div>
                          {labData[key] && (
                              <div className="absolute top-2 right-2 text-emerald-400 bg-emerald-900/80 rounded-full p-1">
                                  <span className="material-symbols-outlined text-sm">check</span>
                              </div>
                          )}
                      </button>
                  ))}
              </div>
              
              {/* Data Log Preview */}
              {isDataSufficient && (
                  <div className="text-center mt-8">
                      <button onClick={() => setPhase('quiz')} className="px-10 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] animate-pulse">
                          數據充足，產生結論報告 &rarr;
                      </button>
                  </div>
              )}
          </div>
      )}

      {/* PHASE 2: TENSION TEST (Paperclips) */}
      {phase === 'tension_test' && (
          <div className="bg-slate-900 border-2 border-cyan-500/30 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-4 right-4 text-cyan-500 text-xs font-mono border border-cyan-500/50 px-2 py-1 rounded">
                  TEST 01: SURFACE TENSION
              </div>
              
              <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold text-white mb-2">迴紋針挑戰 (The Paperclip Challenge)</h3>
                  <p className="text-slate-400 text-sm mb-6 text-center max-w-lg">
                      表面張力越低，滲透力越強，迴紋針越容易沉沒。<br/>
                      <span className="text-cyan-400">目前樣本：{MATERIALS[selectedMat].name}</span>
                  </p>

                  {/* Simulation Visual */}
                  <div className="relative w-64 h-48 bg-blue-900/30 border-b-4 border-x-4 border-slate-500 rounded-b-xl mb-6 overflow-hidden">
                      {/* Water Level */}
                      <div className="absolute bottom-0 w-full h-[90%] bg-blue-500/20 backdrop-blur-sm"></div>
                      
                      {/* Paperclips */}
                      {clips.map((floating, i) => (
                          <div 
                            key={i}
                            className={`absolute w-8 h-3 border-2 border-slate-300 rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center
                                ${floating ? 'top-[15%] animate-[float_3s_infinite_ease-in-out]' : 'top-[90%] rotate-45 opacity-50 border-slate-600'}
                            `}
                            style={{ 
                                left: `${10 + (i % 3) * 30 + (i * 2)}%`,
                                animationDelay: `${i * 0.1}s` 
                            }}
                          >
                              {/* Inner detail of paperclip */}
                              <div className={`w-4 h-1 border border-slate-300 rounded-full ${!floating && 'border-slate-600'}`}></div>
                          </div>
                      ))}
                  </div>

                  <button 
                    onClick={runTensionTest}
                    disabled={isAnimating}
                    className={`px-6 py-2 rounded font-bold flex items-center gap-2 transition-all
                        ${isAnimating ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg'}
                    `}
                  >
                      {isAnimating ? '滴入萃取液...' : '滴入萃取液 (Add Extract)'}
                  </button>
              </div>
          </div>
      )}

      {/* PHASE 3: EMULSION TEST (Oil) */}
      {phase === 'emulsion_test' && (
          <div className="bg-slate-900 border-2 border-cyan-500/30 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-4 right-4 text-emerald-500 text-xs font-mono border border-emerald-500/50 px-2 py-1 rounded">
                  TEST 02: EMULSIFICATION
              </div>

              <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold text-white mb-2">油汙乳化測試 (Oil Clean-up)</h3>
                  <p className="text-slate-400 text-sm mb-6 text-center max-w-lg">
                      皂苷能抓住油汙形成「微胞(Micelle)」，將其從表面帶走。<br/>
                      <span className="text-emerald-400">目前樣本：{MATERIALS[selectedMat].name}</span>
                  </p>

                  {/* Simulation Visual - Plate */}
                  <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl mb-6 overflow-hidden">
                      {/* The Oil Stain */}
                      <div 
                        className="absolute bg-stone-800 w-32 h-32 rounded-full filter blur-sm transition-all duration-1000 ease-out"
                        style={{ 
                            opacity: oilOpacity,
                            transform: isAnimating ? 'scale(0.1) rotate(180deg)' : 'scale(1)' 
                        }}
                      ></div>
                      
                      {/* Micelles Visual (appears when cleaning) */}
                      {isAnimating && (
                          <div className="absolute inset-0 flex items-center justify-center">
                              <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin opacity-50">cyclone</span>
                          </div>
                      )}
                  </div>

                  <button 
                    onClick={runEmulsionTest}
                    disabled={isAnimating}
                    className={`px-6 py-2 rounded font-bold flex items-center gap-2 transition-all
                        ${isAnimating ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}
                    `}
                  >
                      {isAnimating ? '乳化分解中...' : '啟動清潔 (Start Scrubbing)'}
                  </button>
              </div>
          </div>
      )}

      {/* PHASE 4: SINGLE REPORT (After one test) */}
      {phase === 'report' && (
          <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center animate-[scaleIn_0.3s_ease-out]">
              <div className="mb-4">
                  <span className="material-symbols-outlined text-5xl text-cyan-400">analytics</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">單項檢測報告</h3>
              <p className="text-slate-400 text-sm mb-6">{MATERIALS[selectedMat].name}</p>

              <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                      <div className="text-xs text-slate-500 mb-1">起泡力</div>
                      <div className="text-white font-bold">{MATERIALS[selectedMat].foam}</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                      <div className="text-xs text-slate-500 mb-1">表面張力</div>
                      <div className="text-orange-400 font-bold font-mono">
                          {MATERIALS[selectedMat].id === 'water' ? 'High' : 'Low'}
                      </div>
                      <div className="text-[9px] text-slate-500">(承載 {MATERIALS[selectedMat].tensionScore} 支迴紋針)</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                      <div className="text-xs text-slate-500 mb-1">去油率</div>
                      <div className="text-emerald-400 font-bold font-mono text-xl">{MATERIALS[selectedMat].cleanScore}%</div>
                  </div>
              </div>

              <div className="bg-black/40 p-4 rounded text-left text-sm text-slate-300 border-l-4 border-cyan-500 mb-6">
                  <span className="font-bold text-cyan-400 block mb-1">希卡分析：</span>
                  {MATERIALS[selectedMat].desc}
              </div>

              <button onClick={() => setPhase('select')} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
                  返回實驗室 (測試其他樣本)
              </button>
          </div>
      )}

      {/* PHASE 5: FINAL QUIZ/CONCLUSION */}
      {phase === 'quiz' && (
          <div className="bg-slate-900 border-2 border-purple-500/50 p-8 rounded-xl max-w-2xl mx-auto shadow-2xl animate-[fadeIn_0.5s_ease-out]">
              <div className="flex items-center gap-3 mb-6 border-b border-purple-900/50 pb-4">
                  <span className="material-symbols-outlined text-3xl text-purple-400">psychology</span>
                  <h3 className="text-2xl font-bold text-white">實驗結案：數據說話</h3>
              </div>

              <div className="space-y-6">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Comparative Data Log</h4>
                      <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 border-b border-slate-700">
                              <tr>
                                  <th className="pb-2">樣本</th>
                                  <th className="pb-2">泡泡量</th>
                                  <th className="pb-2 text-right">去油率 (Cleanliness)</th>
                              </tr>
                          </thead>
                          <tbody className="text-slate-200">
                              <tr className="border-b border-slate-800">
                                  <td className="py-2">Masa (無患子)</td>
                                  <td className="py-2 text-cyan-400">多 (High)</td>
                                  <td className="py-2 text-right font-mono text-emerald-400">85%</td>
                              </tr>
                              <tr className="border-b border-slate-800">
                                  <td className="py-2">Qqmi' (合歡)</td>
                                  <td className="py-2 text-orange-400">少 (Low)</td>
                                  <td className="py-2 text-right font-mono text-emerald-400">92%</td>
                              </tr>
                              <tr>
                                  <td className="py-2 text-slate-500">Water (對照)</td>
                                  <td className="py-2 text-slate-500">無</td>
                                  <td className="py-2 text-right font-mono text-red-400">5%</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>

                  <div>
                      <p className="text-white font-bold text-lg mb-4">Q: 根據上述數據，科學上如何定義「真正的清潔力」？</p>
                      <div className="space-y-3">
                          <button 
                            onClick={() => checkQuiz(false)}
                            className="w-full text-left p-4 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all text-slate-300 group"
                          >
                              <span className="text-red-400 font-bold mr-2 group-hover:text-red-300">A.</span> 
                              看誰泡泡比較多 (Bubble Volume)
                          </button>
                          <button 
                            onClick={() => checkQuiz(true)}
                            className="w-full text-left p-4 rounded bg-slate-800 hover:bg-slate-700 border border-emerald-500/50 hover:border-emerald-400 transition-all text-slate-300 group shadow-lg"
                          >
                              <span className="text-emerald-400 font-bold mr-2 group-hover:text-emerald-300">B.</span> 
                              測量表面張力與去油率 (Quantitative Data)
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default River;
