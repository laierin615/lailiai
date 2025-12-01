
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
  const [stage, setStage] = useState<SubStage>(1);
  const [showAnalysis, setShowAnalysis] = useState(false); // New state for showing analysis
  
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
      // Check if the answer is from Granary (starts with "Material:")
      // If it is, we treat it as completing stage 2, but we DO NOT populate the topic.
      if (initialAnswer.startsWith("Material:")) {
         setTopic(""); // Clear topic so placeholder shows
         setStage(3);
      } else {
         setTopic(initialAnswer);
         setStage(3); // Jump directly to research topic stage
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
        onSuccessMsg("初始台地試煉完成！<br>你已具備獵人的觀察眼與科學的邏輯心。");
        onComplete();
      }, 1000);
    }, 2000);
  };

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
                className={`min-h-[150px] bg-slate-800/80 border-2 border-dashed rounded-xl p-4 flex flex-col items-center transition-all cursor-pointer hover:bg-slate-700 relative overflow-hidden
                  ${bid === 'water' ? 'border-sky-500/50 text-sky-400 hover:border-sky-400' : ''}
                  ${bid === 'trap' ? 'border-amber-500/50 text-amber-400 hover:border-amber-400' : ''}
                  ${bid === 'shelter' ? 'border-emerald-500/50 text-emerald-400 hover:border-emerald-400' : ''}
                  ${selectedCard && CORRECT_MAPPING[selectedCard] === bid ? 'ring-2 ring-white/20 bg-slate-700/80' : ''}
                `}
              >
                 <span className="material-symbols-outlined text-4xl mb-2">
                   {bid === 'water' ? 'water_drop' : bid === 'trap' ? 'hardware' : 'home_work'}
                 </span>
                 <span className="font-bold uppercase tracking-widest text-xs mb-4">
                   {bid === 'water' ? '水邊 / 編織' : bid === 'trap' ? '陷阱 / 強韌' : '建材 / 遮蔽'}
                 </span>
                 <div className="flex flex-wrap gap-2 justify-center z-10 w-full">
                   {baskets[bid].map(pid => (
                     <div key={pid} className="bg-slate-900 px-2 py-1 rounded text-[10px] border border-slate-600 animate-[slideUp_0.2s_ease-out] flex items-center gap-1 shadow-lg">
                       <span className="material-symbols-outlined text-[10px] opacity-50">{PLANTS[pid].icon}</span>
                       {PLANTS[pid].name}
                     </div>
                   ))}
                 </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h4 className="text-slate-500 text-xs uppercase mb-4 flex justify-between items-center">
                <span>待分類樣本 ({deck.length})</span>
                <span className="text-[10px] italic">點選卡片，再點選上方類別籃</span>
            </h4>
            
            {deck.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                {deck.map(pid => (
                    <button
                    key={pid}
                    onClick={() => setSelectedCard(pid === selectedCard ? null : pid)}
                    className={`w-28 p-2 rounded border-2 transition-all flex flex-col items-center gap-2 transform duration-200
                        ${selectedCard === pid ? 'border-emerald-400 bg-emerald-900/20 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10' : 'border-slate-600 bg-slate-800 hover:border-slate-400 hover:-translate-y-1'}
                    `}
                    >
                    <div className="w-full h-16 rounded overflow-hidden bg-slate-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-slate-400">{PLANTS[pid].icon}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-300">{PLANTS[pid].name}</span>
                    <span className="text-xs text-slate-500 scale-90">{PLANTS[pid].desc}</span>
                    </button>
                ))}
                </div>
            ) : (
                <div className="text-center py-8 text-emerald-500 font-bold animate-pulse">
                    全部分類完成！
                </div>
            )}
          </div>
        </div>
      )}

      {/* HUNTER MENTOR ANALYSIS (Intermission) */}
      {showAnalysis && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-[scaleIn_0.3s_ease-out] relative">
                <div className="flex items-center gap-4 mb-6 border-b border-emerald-900/50 pb-4">
                    <div className="p-3 bg-emerald-900/30 rounded-full border border-emerald-500/50">
                        <span className="material-symbols-outlined text-3xl text-emerald-400">psychology</span>
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-400 font-serif">獵人導師的解析</h3>
                </div>
                
                <div className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
                    <p className="font-bold text-white text-lg">恭喜你！你已經學會用獵人的眼睛看森林了。</p>
                    
                    <div className="bg-emerald-900/10 p-4 rounded-lg border-l-4 border-emerald-500">
                        <h4 className="text-emerald-300 font-bold mb-2">功能導向分類</h4>
                        <p>獵人不像課本用「界門綱目科屬種」來分類，而是依照「生活功能」（能不能吃、能不能蓋房子、是不是陷阱材料）來記憶植物。</p>
                    </div>

                    <div className="bg-emerald-900/10 p-4 rounded-lg border-l-4 border-emerald-500">
                        <h4 className="text-emerald-300 font-bold mb-2">科學與文化的結合</h4>
                        <p>這種分類法看似簡單，其實包含了材料力學（陷阱選材）與生態學（水源指標），是「有科學依據的文化智慧」。</p>
                    </div>
                </div>

                <button 
                    onClick={handleAnalysisNext}
                    className="w-full mt-8 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
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
          <h3 className="text-xl text-slate-300 mb-6 font-serif">試煉 III：研究主題設定</h3>
          <p className="text-slate-400 mb-6 text-sm">請輸入一個你想探究的原住民科學主題。例如：「為什麼石板屋夏天比較涼？」</p>
          
          <div className="relative">
             <input 
               type="text" 
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               placeholder="例如：探討石板屋的熱對流與隔熱效果..."
               className="w-full bg-slate-900 border-2 border-slate-600 p-4 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
               disabled={aiStatus === 'analyzing'}
             />
             {aiStatus === 'analyzing' && (
               <div className="absolute right-4 top-4 text-cyan-400 animate-pulse flex items-center gap-2">
                 <span className="material-symbols-outlined animate-spin">data_usage</span>
                 希卡感應器解析中...
               </div>
             )}
          </div>

          <button 
            onClick={analyzeTopic}
            disabled={topic.length < 5 || aiStatus === 'analyzing'}
            className={`mt-6 px-8 py-3 rounded font-bold transition-all
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
