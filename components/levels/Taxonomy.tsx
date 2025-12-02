
import React, { useState, useEffect } from 'react';
import Granary from './Granary';

interface TaxonomyProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
  initialAnswer?: string;
}

type SubStage = 1 | 2 | 3;
type PlantId = 'begonia' | 'pellionia' | 'crape' | 'derris' | 'silvergrass' | 'bamboo';
type BasketId = 'water' | 'trap' | 'shelter';

const PLANTS: Record<PlantId, { name: string; icon: string; desc: string }> = {
  begonia: { name: '秋海棠', icon: 'local_florist', desc: '莖多汁帶酸' },
  pellionia: { name: '冷清草', icon: 'grass', desc: '三出脈，生長潮濕' },
  crape: { name: '九芎', icon: 'park', desc: '猴不爬，枝條強韌' },
  derris: { name: '魚藤', icon: 'water_bottle', desc: '根含魚藤酮' },
  silvergrass: { name: '五節芒', icon: 'agriculture', desc: '葉緣鋸齒，導水' },
  bamboo: { name: '桂竹', icon: 'forest', desc: '纖維直，抗彎' }
};

// Correct Answers Mapping
const CORRECT_MAPPING: Record<PlantId, BasketId> = {
  begonia: 'water',
  pellionia: 'water',
  crape: 'trap',
  derris: 'trap',
  silvergrass: 'shelter',
  bamboo: 'shelter'
};

const Taxonomy: React.FC<TaxonomyProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer, initialAnswer }) => {
  const [showIntro, setShowIntro] = useState(true); // New Intro State
  const [stage, setStage] = useState<SubStage>(1);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Stage 1 State
  const [baskets, setBaskets] = useState<Record<BasketId, PlantId[]>>({ water: [], trap: [], shelter: [] });
  const [deck, setDeck] = useState<PlantId[]>(Object.keys(PLANTS) as PlantId[]);
  const [selectedCard, setSelectedCard] = useState<PlantId | null>(null);

  // Stage 3 State (AI/Research)
  const [topic, setTopic] = useState("");
  const [aiStatus, setAiStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');

  // Load previous answer if available
  useEffect(() => {
    if (initialAnswer) {
      setShowIntro(false); // Skip intro if resuming
      
      // Check if the answer is from Granary (starts with "Material:")
      if (initialAnswer.startsWith("Material:")) {
         setTopic(""); 
         setStage(3);
      } else {
         setTopic(initialAnswer);
         setStage(3); 
      }
    }
  }, [initialAnswer]);

  // --- Stage 1 Logic ---
  const handleBasketClick = (bid: BasketId) => {
    if (selectedCard) {
      const correctBasket = CORRECT_MAPPING[selectedCard];
      
      if (bid === correctBasket) {
        // Correct Classification
        setBaskets(prev => ({ ...prev, [bid]: [...prev[bid], selectedCard] }));
        setDeck(prev => prev.filter(p => p !== selectedCard));
        setSelectedCard(null);
      } else {
        // Incorrect Classification - Immediate Feedback
        let hint = "";
        
        // Provide plant-specific feedback for better clarity
        if (selectedCard === 'crape') {
            hint = "九芎 (Crape Myrtle) 的枝幹非常強韌且富有彈性，是製作陷阱機關（如吊索）的上等材料。";
        } else if (selectedCard === 'derris') {
            hint = "魚藤 (Derris) 的根部含有魚藤酮，具有毒性，是被動式的『化學陷阱』，用來麻醉魚類。";
        } else {
            // Fallback generic basket hints
            switch (correctBasket) {
                case 'water': hint = "這植物常生長在潮濕陰暗的水邊，或是莖葉多汁，可作為水源指示植物或解渴用..."; break;
                case 'trap': hint = "這植物通常具有特殊的物理強度（製作機關）或是化學特性（迷昏獵物）..."; break;
                case 'shelter': hint = "這植物的莖桿筆直堅硬，或葉片寬長可導水，是建築與編織的良材..."; break;
            }
        }

        onFail(`分類錯誤！<br><span class="text-amber-400 font-bold">${PLANTS[selectedCard].name}</span> 不屬於這個類別。<br><br>提示：${hint}`);
        setSelectedCard(null);
      }
    }
  };

  // Auto-advance to Analysis when deck is empty
  useEffect(() => {
    if (stage === 1 && deck.length === 0 && !showAnalysis) {
      setTimeout(() => {
        setShowAnalysis(true);
      }, 500);
    }
  }, [deck, stage, showAnalysis]);

  const handleAnalysisNext = () => {
    setShowAnalysis(false);
    setStage(2); // Go to Granary
  };

  const handleGranaryComplete = () => {
    setStage(3); // Go to Research Topic
  };

  // --- Stage 3 Logic ---
  const analyzeTopic = () => {
    if (topic.length < 5) return;
    setAiStatus('analyzing');
    setTimeout(() => {
      setAiStatus('done');
      onSaveAnswer(topic);
      setTimeout(() => {
        onSuccessMsg("初始台地試煉完成！<br>你已具備獵人的觀察眼與科學的邏輯心。<br><br>請帶著這份智慧，前往下一站：<b>大地神殿</b>。");
        onComplete();
      }, 1000);
    }, 2000);
  };

  // --- INTRO VIEW ---
  if (showIntro) {
    return (
      <div className="max-w-6xl mx-auto animate-[fadeIn_0.8s_ease-out] pb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-400 font-serif tracking-widest flex items-center justify-center gap-3">
             <span className="material-symbols-outlined text-4xl">visibility</span>
             獵人的視界
          </h2>
          <p className="text-emerald-500/60 text-xs uppercase tracking-[0.3em] mt-2">Indigenous Taxonomy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           {/* Left: Scientific View */}
           <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-700 text-slate-400">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-2">
                 <span className="material-symbols-outlined text-3xl">menu_book</span>
                 <h3 className="text-xl font-bold">生物學家的分類</h3>
              </div>
              <ul className="space-y-6 text-base md:text-lg leading-relaxed list-disc pl-6">
                 <li>基於<b>型態學</b> (花、葉、果實構造)。</li>
                 <li>分類階層：界、門、綱、目、科、屬、種。</li>
                 <li><span className="text-slate-200">例子：</span>山枇杷只有一種學名 <i>Eriobotrya deflexa</i>。</li>
              </ul>
           </div>

           {/* Right: Hunter's View */}
           <div className="bg-slate-900 p-8 rounded-xl border-2 border-emerald-500/50 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full"></div>
              <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/30 pb-2">
                 <span className="material-symbols-outlined text-3xl text-emerald-400">nature_people</span>
                 <h3 className="text-xl font-bold text-emerald-400">鄒族獵人的分類</h3>
              </div>
              <ul className="space-y-6 text-base md:text-lg leading-relaxed list-disc pl-6">
                 <li>基於<b>功能性</b> (能做什麼?) 與 <b>生態區位</b> (長在哪?)。</li>
                 <li>名字即是用途，名字即是地圖。</li>
                 <li><span className="text-white font-bold">重點概念：</span></li>
              </ul>
              
              {/* Concept Cards */}
              <div className="grid grid-cols-1 gap-4 mt-6">
                  <div className="bg-emerald-900/40 p-4 rounded border-l-4 border-emerald-500 text-sm md:text-base">
                      <strong className="block text-emerald-300 text-base md:text-lg mb-2">公 (Poicngu) vs 母 (Meueisi)</strong>
                      這不是性別，而是材質與功能的區分。<br/>
                      <span className="text-white">● 母樹：</span>會結果實，吸引獵物 (好獵場)，材質較鬆。<br/>
                      <span className="text-white">● 公樹：</span>不結果，但木質緊密強韌，適合做弓箭。
                  </div>
                  <div className="bg-emerald-900/40 p-4 rounded border-l-4 border-amber-500 text-sm md:text-base">
                      <strong className="block text-amber-300 text-base md:text-lg mb-2">棲地決定名字 (Etuu vs Kaituonx)</strong>
                      同樣是山枇杷，獵人依海拔區分：<br/>
                      <span className="text-white">● 高海拔 (Etuu)：</span>生長慢、年輪密、彈性好 (做陷阱)。<br/>
                      <span className="text-white">● 低海拔 (Kaituonx)：</span>生長快、質地鬆軟 (僅當柴火)。
                  </div>
              </div>
           </div>
        </div>

        <div className="text-center">
           <button 
             onClick={() => setShowIntro(false)}
             className="px-12 py-5 bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
           >
             <span className="material-symbols-outlined text-2xl">sensors</span>
             啟動希卡感應器：開始分類
           </button>
           <p className="text-slate-500 text-sm mt-4">試著用獵人的眼睛，重新審視森林中的萬物。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-400 font-serif">初始台地：靈感的狩獵</h2>
        <div className="flex justify-center gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-all ${stage >= i ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`}></div>
          ))}
        </div>
      </div>

      {/* STAGE 1: CLASSIFICATION */}
      {stage === 1 && !showAnalysis && (
        <div className="animate-[fadeIn_0.5s_ease-out]">
          <h3 className="text-xl text-center text-slate-300 mb-6 font-serif">試煉 I：獵人的分類學</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {(['water', 'trap', 'shelter'] as BasketId[]).map(bid => (
              <div 
                key={bid}
                onClick={() => handleBasketClick(bid)}
                className={`min-h-[180px] bg-slate-800/80 border-2 border-dashed rounded-xl p-4 flex flex-col items-center transition-all cursor-pointer hover:bg-slate-700 relative overflow-hidden
                  ${bid === 'water' ? 'border-sky-500/50 text-sky-400 hover:border-sky-400' : ''}
                  ${bid === 'trap' ? 'border-amber-500/50 text-amber-400 hover:border-amber-400' : ''}
                  ${bid === 'shelter' ? 'border-emerald-500/50 text-emerald-400 hover:border-emerald-400' : ''}
                  ${selectedCard && CORRECT_MAPPING[selectedCard] === bid ? 'ring-2 ring-white/20 bg-slate-700/80' : ''}
                `}
              >
                 <span className="material-symbols-outlined text-5xl mb-3">
                   {bid === 'water' ? 'water_drop' : bid === 'trap' ? 'hardware' : 'home_work'}
                 </span>
                 <span className="font-bold uppercase tracking-widest text-sm md:text-base mb-4">
                   {bid === 'water' ? '水邊 / 編織' : bid === 'trap' ? '陷阱 / 強韌' : '建材 / 遮蔽'}
                 </span>
                 <div className="flex flex-wrap gap-2 justify-center z-10 w-full">
                   {baskets[bid].map(pid => (
                     <div key={pid} className="bg-slate-900 px-3 py-1 rounded text-xs border border-slate-600 animate-[slideUp_0.2s_ease-out] flex items-center gap-1 shadow-lg">
                       <span className="material-symbols-outlined text-xs opacity-50">{PLANTS[pid].icon}</span>
                       {PLANTS[pid].name}
                     </div>
                   ))}
                 </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h4 className="text-slate-500 text-sm uppercase mb-4 flex justify-between items-center">
                <span>待分類樣本 ({deck.length})</span>
                <span className="text-xs italic">點選卡片，再點選上方類別籃</span>
            </h4>
            
            {deck.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                {deck.map(pid => (
                    <button
                    key={pid}
                    onClick={() => setSelectedCard(pid === selectedCard ? null : pid)}
                    className={`w-32 p-3 rounded border-2 transition-all flex flex-col items-center gap-2 transform duration-200
                        ${selectedCard === pid ? 'border-emerald-400 bg-emerald-900/20 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10' : 'border-slate-600 bg-slate-800 hover:border-slate-400 hover:-translate-y-1'}
                    `}
                    >
                    <div className="w-full h-20 rounded overflow-hidden bg-slate-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-400">{PLANTS[pid].icon}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-300">{PLANTS[pid].name}</span>
                    <span className="text-xs text-slate-500 scale-90 block">{PLANTS[pid].desc}</span>
                    </button>
                ))}
                </div>
            ) : (
                <div className="text-center py-8 text-emerald-500 font-bold animate-pulse text-lg">
                    全部分類完成！
                </div>
            )}
          </div>
        </div>
      )}

      {/* HUNTER MENTOR ANALYSIS (Intermission) */}
      {showAnalysis && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-xl p-8 max-w-4xl w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-[scaleIn_0.3s_ease-out] relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-4 mb-6 border-b border-emerald-900/50 pb-4">
                    <div className="p-3 bg-emerald-900/30 rounded-full border border-emerald-500/50">
                        <span className="material-symbols-outlined text-4xl text-emerald-400">psychology</span>
                    </div>
                    <h3 className="text-3xl font-bold text-emerald-400 font-serif">獵人導師的解析：解鎖分類密碼</h3>
                </div>
                
                <div className="space-y-8 text-slate-300 leading-relaxed text-base md:text-lg">
                    <p className="font-bold text-white text-xl border-l-4 border-emerald-500 pl-4">「你已學會用獵人的眼睛看森林。」</p>
                    <p>鄒族獵人的植物分類學，不只是外觀的辨識，更是數百年來與山林共存的實證科學。與生物課本不同，獵人有幾套獨特的分類密碼：</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Concept 1: Male vs Female */}
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors">
                            <h4 className="text-emerald-300 font-bold mb-3 flex items-center gap-2 text-lg">
                                <span className="material-symbols-outlined text-xl">wc</span>
                                二元分類：公樹與母樹
                            </h4>
                            <p className="text-sm text-slate-400 mb-3">獵人將植物分為「公 (Poicngu)」與「母 (Meueisi)」，這不是生物學上的雌雄，而是功能的區分：</p>
                            <ul className="text-base list-disc pl-5 space-y-2">
                                <li><b>公樹</b>：通常不結果，木質緊密強韌。用途：製作弓箭、獵具。</li>
                                <li><b>母樹</b>：會結果實，木質較鬆軟。用途：吸引獵物覓食。</li>
                            </ul>
                        </div>

                        {/* Concept 2: Altitude & Material Physics */}
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors">
                            <h4 className="text-emerald-300 font-bold mb-3 flex items-center gap-2 text-lg">
                                <span className="material-symbols-outlined text-xl">terrain</span>
                                棲地與材料力學
                            </h4>
                            <p className="text-sm text-slate-400 mb-3">同一種植物，生長在不同環境，其物理特性不同，獵人會給予不同命名：</p>
                            <ul className="text-base list-disc pl-5 space-y-2">
                                <li><b>高海拔 (Etuu)</b>：生長慢，年輪密，彈性極佳。適合：強弓。</li>
                                <li><b>低海拔 (Kaituonx)</b>：生長快，質地鬆。適合：一般薪柴。</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-emerald-900/20 p-6 rounded-lg border-t border-emerald-500/30">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2 text-lg">
                            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                            研究結論
                        </h4>
                        <p className="text-base">這種分類法包含了<b>「材料力學」</b>(選材做陷阱) 與 <b>「生態學」</b>(尋找水源指標)，是高度科學化的文化智慧。</p>
                    </div>
                </div>

                <button 
                    onClick={handleAnalysisNext}
                    className="w-full mt-10 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-lg"
                >
                    前往下一試煉：會呼吸的穀倉 <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
      )}

      {/* STAGE 2: GRANARY (The Physics of Yulu) */}
      {stage === 2 && (
        <div className="animate-[fadeIn_0.5s_ease-out]">
          <h3 className="text-xl text-center text-slate-300 mb-6 font-serif">試煉 II：防鼠板物理 (會呼吸的穀倉)</h3>
          <Granary 
            onComplete={handleGranaryComplete}
            onFail={onFail}
            onSuccessMsg={onSuccessMsg}
            onSaveAnswer={onSaveAnswer}
          />
        </div>
      )}

      {/* STAGE 3: RESEARCH TOPIC */}
      {stage === 3 && (
        <div className="animate-[fadeIn_0.5s_ease-out] max-w-2xl mx-auto text-center pt-10">
          <h3 className="text-2xl text-slate-300 mb-6 font-serif">試煉 III：研究主題設定</h3>
          <p className="text-slate-400 mb-6 text-base">請輸入一個你想探究的原住民科學主題。例如：「為什麼石板屋夏天比較涼？」</p>
          
          <div className="relative">
             <input 
               type="text" 
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               placeholder="例如：探討石板屋的熱對流與隔熱效果..."
               className="w-full bg-slate-900 border-2 border-slate-600 p-5 rounded-xl text-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
               disabled={aiStatus === 'analyzing'}
             />
             {aiStatus === 'analyzing' && (
               <div className="absolute right-4 top-5 text-cyan-400 animate-pulse flex items-center gap-2">
                 <span className="material-symbols-outlined animate-spin">data_usage</span>
                 希卡感應器解析中...
               </div>
             )}
          </div>

          <button 
            onClick={analyzeTopic}
            disabled={topic.length < 5 || aiStatus === 'analyzing'}
            className={`mt-8 px-10 py-4 rounded-xl font-bold transition-all text-lg
              ${aiStatus === 'done' ? 'bg-emerald-600 text-white' : topic.length >= 5 ? 'bg-cyan-700 hover:bg-cyan-600 text-white' : 'bg-slate-800 text-slate-600'}
            `}
          >
            {aiStatus === 'analyzing' ? '分析中...' : '提交希卡石板'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Taxonomy;
