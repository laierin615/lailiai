
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface TrapProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
  initialAnswer?: string;
}

type RopeType = 'banana' | 'rattan';
type Phase = 'setup' | 'simulating' | 'diagram' | 'dialogue' | 'task';

interface AiResult {
  independent: string;
  dependent: string;
  control: string;
  proposal: string;
}

// Custom Boar SVG Icon
const BoarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={`w-full h-full ${className}`} fill="currentColor" stroke="none">
    <path d="M 85 25 C 80 10 60 5 40 10 C 25 15 10 25 5 35 C 0 45 10 50 15 50 L 20 58 L 30 58 L 30 48 L 60 48 L 60 58 L 70 58 L 75 45 C 85 45 95 35 85 25 Z" />
    <path d="M 88 35 L 95 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <circle cx="75" cy="22" r="2" fill="white" />
    <path d="M 90 30 Q 95 35 90 40" stroke="transparent" /> 
  </svg>
);

const Trap: React.FC<TrapProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer, initialAnswer }) => {
  const [phase, setPhase] = useState<Phase>('setup');
  
  // Simulation Vars
  const [mass, setMass] = useState(30); 
  const [height, setHeight] = useState(100); 
  const [rope, setRope] = useState<RopeType>('banana');
  
  // Task Inputs & AI
  const [researchTopic, setResearchTopic] = useState("");
  const [independentVar, setIndependentVar] = useState("");
  const [dependentVar, setDependentVar] = useState("");
  const [controlVar, setControlVar] = useState("");
  
  // AI Modal State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  // Animation States
  const [boarPos, setBoarPos] = useState(100); // % from left
  const [logAngle, setLogAngle] = useState(-30); // Degrees
  const [statusText, setStatusText] = useState("等待設置...");
  const [ropeSnapped, setRopeSnapped] = useState(false);

  // Constants
  const targetAngle = -10 - ((height - 50) / 100) * 35; 

  // Parse Initial Answer if available
  useEffect(() => {
    if (initialAnswer) {
      // Try to parse structured format first
      const topicMatch = initialAnswer.match(/Topic: (.*?) \|/);
      const indepMatch = initialAnswer.match(/IV: (.*?) \|/);
      const depMatch = initialAnswer.match(/DV: (.*?) \|/);
      const controlMatch = initialAnswer.match(/CV: (.*)/);

      if (topicMatch) setResearchTopic(topicMatch[1]);
      if (indepMatch) setIndependentVar(indepMatch[1]);
      if (depMatch) setDependentVar(depMatch[1]);
      if (controlMatch) setControlVar(controlMatch[1]);

      // Legacy format fallback (if needed)
      if (!topicMatch) {
          const legacyTopic = initialAnswer.match(/Topic: (.*?),/);
          if (legacyTopic) setResearchTopic(legacyTopic[1]);
      }

      setPhase('task');
    }
  }, [initialAnswer]);

  useEffect(() => {
    if (phase === 'setup') {
      setLogAngle(targetAngle);
      setBoarPos(100);
      setRopeSnapped(false);
      setStatusText("等待設置...");
    }
  }, [phase, height, targetAngle]);

  const triggerTrap = () => {
    setPhase('simulating');
    setStatusText("山豬 (Wild Boar) 接近中...");
    
    // 1. Boar Enters
    setTimeout(() => setBoarPos(40), 100); 

    setTimeout(() => {
      // 2. Trigger
      setStatusText("觸發機關！");
      
      let success = false;
      let snap = false;
      let miss = false;
      let weak = false;
      let failMsg = "";

      if (rope === 'banana' && mass > 20) {
        snap = true;
        failMsg = "繩索斷裂！香蕉絲無法承受此重量的瞬間張力。";
      } else if (height > 130) {
        miss = true;
        failMsg = "高度過高！掉落時間太長 (t)，山豬被嚇跑了。";
      } else if (mass < 30 || height < 60) {
        weak = true;
        failMsg = mass < 30 ? "重量不足！無法造成足夠的衝擊力 (F)。" : "高度太低！重力位能 (Ug) 不足。";
      } else if (rope === 'rattan') {
        success = true;
      } else {
        if (rope === 'banana') {
             weak = true;
             failMsg = "雖然繩子沒斷，但香蕉絲彈性過大，吸收了衝擊力。";
        } else {
             success = true;
        }
      }

      if (snap) {
        setRopeSnapped(true);
        setStatusText("啪！繩子斷了！");
        setTimeout(() => {
            setBoarPos(100); // Run away right
            setTimeout(() => {
                onFail(failMsg);
                setPhase('setup'); 
            }, 1500);
        }, 500);
      } else if (miss) {
        setLogAngle(0); 
        setStatusText("動作太慢！");
        setBoarPos(-20); 
        setTimeout(() => {
            onFail(failMsg);
            setPhase('setup');
        }, 2000);
      } else if (weak) {
        setLogAngle(0);
        setStatusText("衝擊力不足！");
        setTimeout(() => setBoarPos(-20), 500);
        setTimeout(() => {
            onFail(failMsg);
            setPhase('setup');
        }, 2000);
      } else if (success) {
        setLogAngle(0);
        setStatusText("Rangay 啟動！");
        setTimeout(() => {
            setStatusText("捕獲成功！");
            setTimeout(() => setPhase('diagram'), 2000);
        }, 300);
      }

    }, 2500); 
  };

  const handleAiAssist = async () => {
    if (!process.env.API_KEY) {
        console.error("API Key not found");
        return;
    }
    setIsAiLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const topic = researchTopic.trim() || "改良原住民陷阱的機械結構";
        const prompt = `
            You are a science fair mentor. The student's topic is: "${topic}".
            
            Task:
            1. Write a short, encouraging "Sheikah Mentor Analysis" (proposal) in Traditional Chinese (approx 100 words). Explain WHY this topic is scientifically interesting.
            2. Identify the Independent, Dependent, and Control variables.

            Return a valid JSON object.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        proposal: { type: Type.STRING, description: "Short research analysis/encouragement in Traditional Chinese" },
                        independent: { type: Type.STRING, description: "Independent variable in Traditional Chinese" },
                        dependent: { type: Type.STRING, description: "Dependent variable in Traditional Chinese" },
                        control: { type: Type.STRING, description: "Control variables in Traditional Chinese" }
                    },
                    required: ["proposal", "independent", "dependent", "control"],
                }
            }
        });

        let text = response.text || "{}";
        
        // Robust JSON Parsing
        try {
            // 1. Try cleaning markdown
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // 2. Try finding JSON bounds if garbage exists
            const firstBrace = cleanText.indexOf('{');
            const lastBrace = cleanText.lastIndexOf('}');
            
            let jsonString = cleanText;
            if (firstBrace !== -1 && lastBrace !== -1) {
                jsonString = cleanText.substring(firstBrace, lastBrace + 1);
            }

            const data = JSON.parse(jsonString);
            
            if (data.independent) {
                setAiResult({
                    proposal: data.proposal || "分析完成，請檢視以下變因。",
                    independent: data.independent,
                    dependent: data.dependent,
                    control: data.control
                });
                setShowAiModal(true); 
            } else {
                throw new Error("Missing required fields");
            }

        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, text);
            throw new Error("Failed to parse AI response");
        }

    } catch (error) {
        console.error("AI Error", error);
        onFail("希卡導師連線受到磁場干擾 (JSON Error)，請再試一次。");
    } finally {
        setIsAiLoading(false);
    }
  };

  const applyAiResult = () => {
      if (aiResult) {
          setIndependentVar(aiResult.independent);
          setDependentVar(aiResult.dependent);
          setControlVar(aiResult.control);
          setShowAiModal(false);
      }
  };

  const submitTask = () => {
    if (independentVar && dependentVar && controlVar) {
      // Save in a clear, structured format using pipes | for separation
      const structuredAnswer = `Topic: ${researchTopic || 'Default'} | IV: ${independentVar} | DV: ${dependentVar} | CV: ${controlVar}`;
      onSaveAnswer(structuredAnswer);
      onSuccessMsg("實驗設計已登錄！<br>你成功將傳統智慧轉化為科學語言。<br>此數據將同步至希卡塔(Final Level)。");
      onComplete();
    } else {
      onFail("請完整填寫所有變因欄位。");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-orange-400 font-serif tracking-widest flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl">hardware</span>
          Rangay：致命的衝擊力
        </h2>
        <p className="text-orange-500/60 text-xs uppercase tracking-[0.3em] mt-2">Trial of Power</p>
      </div>

      {/* PHASE 1 & 2: SETUP & SIMULATION & DIAGRAM */}
      {(phase === 'setup' || phase === 'simulating' || phase === 'diagram') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeIn_0.5s_ease-out]">
          
          {/* Controls (Left Side - 1/3) */}
          <div className="lg:col-span-1 bg-slate-900/90 p-6 rounded-xl border-2 border-orange-700/50 flex flex-col space-y-6 shadow-xl h-fit order-2 lg:order-1">
            <h3 className="font-bold text-orange-200 border-b border-orange-900/50 pb-2 flex items-center gap-2 text-lg">
              <span className="material-symbols-outlined text-base text-orange-500">tune</span> 
              變因控制台 (Variables)
            </h3>
            
            {/* Mass */}
            <div>
              <label className="text-sm text-orange-500 font-bold mb-3 block flex justify-between">
                <span>1. 壓重 (Mass)</span>
                <span className="text-slate-400 font-mono text-xs pt-1">石板數量</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 40].map(m => (
                  <button
                    key={m}
                    onClick={() => phase === 'setup' && setMass(m)}
                    className={`p-3 rounded text-sm border transition-all font-mono relative overflow-hidden flex flex-col items-center
                      ${mass === m ? 'bg-orange-900 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-400'}
                      ${phase !== 'setup' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}
                    `}
                  >
                    <span className="text-xl font-bold">{m}</span>
                    <span className="text-xs">kg</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="flex justify-between text-sm text-orange-500 font-bold mb-3">
                <span>2. 設置高度 (Height)</span>
                <span className="font-mono text-white text-lg">{height} cm</span>
              </label>
              <input
                type="range"
                min="50"
                max="150"
                step="10"
                value={height}
                onChange={(e) => phase === 'setup' && setHeight(parseInt(e.target.value))}
                disabled={phase !== 'setup'}
                className="w-full h-3 bg-slate-800 rounded-lg cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1 font-mono">
                <span>Low (50)</span>
                <span>High (150)</span>
              </div>
            </div>

            {/* Rope */}
            <div>
              <label className="text-sm text-orange-500 font-bold mb-3 block">3. 繩索材質 (Material)</label>
              <div className="flex gap-2">
                <button
                  onClick={() => phase === 'setup' && setRope('banana')}
                  className={`flex-1 p-4 rounded text-sm border transition-all flex items-center justify-center gap-2
                    ${rope === 'banana' ? 'bg-orange-900/80 border-orange-500 text-white ring-1 ring-orange-500/50' : 'bg-slate-800 border-slate-700 text-slate-400'}
                    ${phase !== 'setup' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="material-symbols-outlined text-lime-400">eco</span> 香蕉絲
                </button>
                <button
                  onClick={() => phase === 'setup' && setRope('rattan')}
                  className={`flex-1 p-4 rounded text-sm border transition-all flex items-center justify-center gap-2
                    ${rope === 'rattan' ? 'bg-orange-900/80 border-orange-500 text-white ring-1 ring-orange-500/50' : 'bg-slate-800 border-slate-700 text-slate-400'}
                    ${phase !== 'setup' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="material-symbols-outlined text-amber-600">radio_button_checked</span> 黃藤
                </button>
              </div>
            </div>

            <button
              onClick={triggerTrap}
              disabled={phase !== 'setup'}
              className={`w-full font-bold py-5 rounded-lg shadow-lg transition-all border flex items-center justify-center gap-2 mt-auto text-lg
                ${phase !== 'setup' ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-gradient-to-r from-orange-700 to-red-700 text-white border-orange-500 hover:scale-[1.02] hover:shadow-orange-900/50'}
              `}
            >
              {phase === 'setup' ? (
                  <>
                    <span className="material-symbols-outlined text-2xl">play_circle</span> 開始模擬
                  </>
              ) : '模擬進行中...'}
            </button>
          </div>

          {/* Visual Simulation (Right Side - 2/3) */}
          <div className="lg:col-span-2 bg-black rounded-xl border-4 border-slate-800 relative h-[500px] overflow-hidden group shadow-2xl order-1 lg:order-2">
            
            {/* ... (Visual code remains same) ... */}
            {/* Background Layer */}
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Haeckel_Filicinae_4.jpg/640px-Haeckel_Filicinae_4.jpg')] bg-cover opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/80"></div>

            {/* Ground */}
            <div className="absolute bottom-0 w-full h-16 bg-[#1c1917] border-t-2 border-[#44403c] flex items-center justify-around">
                {Array.from({length: 20}).map((_,i) => (
                    <div key={i} className="w-1 h-3 bg-stone-600 rounded-t-full transform rotate-12 opacity-30"></div>
                ))}
            </div>

            {/* Trap Mechanism */}
            <div className="absolute bottom-16 left-[20%] w-0 h-0 z-20 pointer-events-none">
                <div className="absolute bottom-0 -left-4 w-8 h-16 bg-stone-600 rounded-t-sm z-20 border-r border-stone-800 shadow-xl"></div>
                <div 
                    className="absolute bottom-14 -left-2 w-[450px] h-20 bg-[#3f2e18] rounded-r-xl z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center origin-[10px_50%] transition-transform duration-200 ease-in border-y border-[#5e4324]"
                    style={{ 
                        transform: `rotate(${logAngle}deg)`,
                        backgroundImage: 'repeating-linear-gradient(90deg, #3f2e18 0px, #4d3820 10px, #3f2e18 20px)'
                    }}
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 transform">
                        {Array.from({length: mass/10}).map((_, i) => (
                            <div key={i} className="w-10 h-10 bg-stone-500 rounded-md border-b-4 border-stone-700 shadow-lg relative">
                                <div className="absolute top-1 left-1 w-full h-full bg-white/10 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                </div>
                {!ropeSnapped && (
                    <div 
                        className={`absolute w-1 origin-top z-10 transition-all duration-200 ${rope === 'banana' ? 'bg-lime-200/80' : 'bg-amber-600'}`}
                        style={{
                            height: '500px',
                            left: '350px',
                            bottom: '70px',
                            transform: `rotate(${logAngle * 0.9}deg)`,
                            opacity: (phase === 'simulating' && logAngle === 0) ? 0 : 1
                        }}
                    ></div>
                )}
            </div>

            {/* Boar Icon */}
            <div 
                className="absolute bottom-16 z-10 transition-all duration-100 ease-linear"
                style={{ 
                    left: `${boarPos}%`,
                    transform: 'translateX(-50%)',
                    filter: phase === 'diagram' ? 'grayscale(100%) brightness(50%)' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
                }}
            >
                <div className="relative w-24 h-16">
                    <BoarIcon className="text-stone-300" />
                    {(phase === 'diagram' || statusText.includes('斷') || statusText.includes('逃')) && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold text-2xl animate-bounce">!</div>
                    )}
                </div>
            </div>

            {/* HUD Status */}
            <div className="absolute top-4 left-4 font-mono text-sm bg-black/60 px-4 py-2 rounded border-l-2 border-orange-500 text-orange-100 backdrop-blur-md z-30">
                <div className="text-orange-500 font-bold mb-1 text-xs">SYSTEM STATUS</div>
                <div className="font-bold">{statusText}</div>
            </div>

            {/* --- DIAGRAM OVERLAY (Phase 3) --- */}
            {phase === 'diagram' && (
                <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-40 animate-[fadeIn_0.5s_ease-out] flex flex-col p-6 overflow-y-auto">
                    <h3 className="text-2xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-2 text-center shrink-0">科學解構：Rangay</h3>
                    
                    <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8">
                        {/* Diagram Illustration */}
                        <div className="relative w-full md:w-1/2 aspect-[4/3] bg-slate-800 rounded-lg border border-slate-600 p-4 shadow-xl shrink-0">
                            {/* Lines */}
                            <div className="absolute bottom-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm z-10 shadow-lg">支</div>
                            <div className="absolute bottom-4 left-8 w-[80%] h-1 bg-white origin-left -rotate-12"></div>
                            <div className="absolute bottom-16 left-[40%] w-20 h-16 bg-orange-500/50 border border-orange-400 flex items-center justify-center text-white text-sm font-bold backdrop-blur-sm">
                                重物 (m)
                            </div>
                            <div className="absolute bottom-0 w-full h-px bg-slate-500 border-t border-dashed"></div>
                            
                            {/* Force Label */}
                            <div className="absolute bottom-4 right-[10%] text-cyan-400 font-mono text-base font-bold">
                                ↓ F (衝擊)
                            </div>
                        </div>

                        {/* Text Explanation */}
                        <div className="space-y-4 text-left w-full md:w-1/2">
                            <div className="bg-slate-800 px-4 py-3 rounded border-l-4 border-orange-500 text-orange-100 shadow-lg">
                                <span className="block font-bold mb-1 text-base">重力位能 (Potential Energy)</span>
                                <span className="font-mono text-sm">Ug = mgh</span>
                                <p className="text-slate-400 mt-1 text-sm">高度與重量決定了陷阱的能量上限。</p>
                            </div>
                            <div className="bg-slate-800 px-4 py-3 rounded border-l-4 border-cyan-500 text-cyan-100 shadow-lg">
                                <span className="block font-bold mb-1 text-base">衝量 (Impulse)</span>
                                <span className="font-mono text-sm">J = F × Δt</span>
                                <p className="text-slate-400 mt-1 text-sm">硬碰硬：接觸時間 (Δt) 越短，衝擊力 (F) 越大。</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setPhase('dialogue')}
                        className="mt-6 w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 text-lg"
                    >
                        進入傳承對話 <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: DIALOGUE */}
      {phase === 'dialogue' && (
        <div className="animate-[slideUp_0.5s_ease-out] bg-slate-900 border-2 border-amber-700/50 rounded-xl overflow-hidden max-w-4xl mx-auto shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Tradition */}
                <div className="p-10 bg-amber-900/20 border-b md:border-b-0 md:border-r border-amber-800/50 flex flex-col justify-center relative">
                    <div className="absolute top-4 left-4 text-amber-500/30 text-6xl font-serif opacity-20">VUVU</div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl">face</span> Basan 爺爺的智慧
                        </h3>
                        <blockquote className="text-amber-100 italic text-xl leading-relaxed border-l-4 border-amber-600 pl-6 mb-4">
                            「不能太高，因為掉下來太慢獵物會跑掉；也不能太低，打不暈山豬。」
                        </blockquote>
                    </div>
                </div>

                {/* Right: Science */}
                <div className="p-10 bg-slate-800/50 flex flex-col justify-center relative">
                    <div className="absolute top-4 right-4 text-cyan-500/30 text-6xl font-mono opacity-20">PHYSICS</div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl">science</span> 科學的語言
                        </h3>
                        <ul className="space-y-6 text-slate-300 text-base">
                            <li className="flex gap-4">
                                <span className="text-cyan-500 font-bold text-lg">●</span>
                                <span>
                                    <strong className="text-white block text-lg mb-2">最佳化 (Optimization)</strong>
                                    爺爺所說的「不能太高，對應了物理上的權衡：高度雖增加能量，但也增加了掉落時間。
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-black/40 text-center border-t border-slate-700">
                <button 
                    onClick={() => setPhase('task')}
                    className="px-12 py-4 bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white font-bold rounded shadow-lg transform transition hover:-translate-y-1 text-lg"
                >
                    前往實驗設計任務
                </button>
            </div>
        </div>
      )}

      {/* PHASE 4: TASK */}
      {phase === 'task' && (
        <div className="animate-[fadeIn_0.5s_ease-out] bg-slate-900 border border-slate-700 rounded-xl p-10 max-w-4xl mx-auto shadow-2xl relative">
            <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-white mb-3">獵人筆記：定義變因</h3>
                <p className="text-orange-400 text-base font-bold">根據你的研究主題，試著將剛剛的觀察轉化為符合你研究的實驗設計</p>
            </div>

            <div className="mb-10">
                <label className="block text-slate-300 text-base font-bold mb-3">你的研究主題 (Research Topic)</label>
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        className="flex-grow bg-slate-800 border border-slate-600 rounded p-4 text-white text-lg focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="例如：改良原住民陷阱的機械結構"
                        value={researchTopic}
                        onChange={(e) => setResearchTopic(e.target.value)}
                    />
                    <button 
                        onClick={handleAiAssist}
                        disabled={isAiLoading}
                        className={`px-6 py-4 rounded font-bold text-base flex items-center gap-2 whitespace-nowrap transition-all border
                            ${isAiLoading 
                                ? 'bg-slate-700 text-slate-500 border-slate-600 cursor-wait' 
                                : 'bg-cyan-900/50 hover:bg-cyan-800 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-cyan-500/40'}
                        `}
                    >
                        {isAiLoading ? (
                            <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : (
                            <span className="material-symbols-outlined">auto_awesome</span>
                        )}
                        希卡導師
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-orange-500">
                    <label className="block text-orange-400 font-bold mb-2 text-base">操縱變因 (Independent Variable)</label>
                    <p className="text-sm text-slate-500 mb-3">你想改變且測試的唯一條件 (例如：石頭的重量)</p>
                    <input 
                        type="text" 
                        className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-orange-500 outline-none transition-colors text-base"
                        placeholder="在此輸入..."
                        value={independentVar}
                        onChange={(e) => setIndependentVar(e.target.value)}
                    />
                </div>

                <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-cyan-500">
                    <label className="block text-cyan-400 font-bold mb-2 text-base">應變變因 (Dependent Variable)</label>
                    <p className="text-sm text-slate-500 mb-3">因操縱變因改變而產生的結果 (例如：陷阱的衝擊力)</p>
                    <input 
                        type="text" 
                        className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors text-base"
                        placeholder="在此輸入..."
                        value={dependentVar}
                        onChange={(e) => setDependentVar(e.target.value)}
                    />
                </div>

                <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-emerald-500">
                    <label className="block text-emerald-400 font-bold mb-2 text-base">控制變因 (Control Variables)</label>
                    <p className="text-sm text-slate-500 mb-3">必須保持不變的條件 (例如：繩索材質、懸掛高度...)</p>
                    <input 
                        type="text" 
                        className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 outline-none transition-colors text-base"
                        placeholder="在此輸入..."
                        value={controlVar}
                        onChange={(e) => setControlVar(e.target.value)}
                    />
                </div>

                <div className="flex justify-end pt-6">
                    <button 
                        onClick={submitTask}
                        className="px-10 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded hover:shadow-lg transition-all transform hover:translate-y-[-2px] text-lg"
                    >
                        提交實驗計畫
                    </button>
                </div>
            </div>
            
            {/* --- AI PROPOSAL MODAL POPUP --- */}
            {showAiModal && aiResult && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border-2 border-cyan-500 rounded-xl p-8 max-w-4xl w-full shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-[scaleIn_0.3s_ease-out] relative max-h-[90vh] overflow-y-auto">
                        
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 border-b border-cyan-900/50 pb-4">
                            <div className="p-3 bg-cyan-900/30 rounded-full border border-cyan-500/50">
                                <span className="material-symbols-outlined text-4xl text-cyan-400">psychology</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-cyan-400 font-serif">希卡導師分析報告</h3>
                                <p className="text-cyan-500/60 text-xs uppercase tracking-widest mt-1">Sheikah Mentor Analysis</p>
                            </div>
                        </div>

                        {/* Proposal Content */}
                        <div className="mb-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                            <h4 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined">description</span> 研究構想建議
                            </h4>
                            <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap font-serif">
                                {aiResult.proposal}
                            </p>
                        </div>

                        {/* Variables Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-slate-800/80 p-5 rounded border-l-4 border-orange-500">
                                <span className="text-orange-500 text-xs font-bold uppercase block mb-1">操縱變因 (INDEPENDENT VAR)</span>
                                <h5 className="text-white font-bold text-lg">{aiResult.independent}</h5>
                            </div>
                            <div className="bg-slate-800/80 p-5 rounded border-l-4 border-cyan-500">
                                <span className="text-cyan-500 text-xs font-bold uppercase block mb-1">應變變因 (DEPENDENT VAR)</span>
                                <h5 className="text-white font-bold text-lg">{aiResult.dependent}</h5>
                            </div>
                            <div className="bg-slate-800/80 p-5 rounded border-l-4 border-emerald-500">
                                <span className="text-emerald-500 text-xs font-bold uppercase block mb-1">控制變因 (CONTROL VAR)</span>
                                <h5 className="text-white font-bold text-lg">{aiResult.control}</h5>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 justify-end border-t border-slate-800 pt-6">
                            <button 
                                onClick={() => setShowAiModal(false)}
                                className="px-6 py-3 text-slate-400 hover:text-white font-bold transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={applyAiResult}
                                className="px-8 py-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                            >
                                <span className="material-symbols-outlined">edit_note</span>
                                寫入希卡石板 (填入變因)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Trap;
