
import React, { useState } from 'react';

interface DyeProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

type Ingredient = 'ramie' | 'shulang' | 'ash' | 'mud' | 'acid';
type PuzzleStage = 1 | 2 | 3; // 1: Bridge, 2: Wall, 3: Cape
type Phase = 'puzzle' | 'knowledge';

const INGREDIENTS: { id: Ingredient; name: string; icon: string; desc: string; color: string }[] = [
  { id: 'ramie', name: '苧麻', icon: 'gesture', desc: '基礎線材', color: 'text-slate-200' },
  { id: 'shulang', name: '薯榔', icon: 'eco', desc: '單寧色素', color: 'text-red-800' },
  { id: 'ash', name: '草木灰', icon: 'local_fire_department', desc: '鹼性漂白', color: 'text-gray-400' },
  { id: 'mud', name: '黑泥', icon: 'landscape', desc: '富含鐵質', color: 'text-stone-600' },
  { id: 'acid', name: '酸性果實', icon: 'nutrition', desc: '顯影劑', color: 'text-yellow-400' },
];

const Dye: React.FC<DyeProps> = ({ onComplete, onSuccessMsg, onSaveAnswer }) => {
  const [phase, setPhase] = useState<Phase>('puzzle');
  const [puzzleStage, setPuzzleStage] = useState<PuzzleStage>(1);
  const [pot, setPot] = useState<Ingredient[]>([]);
  const [isCooking, setIsCooking] = useState(false);
  const [message, setMessage] = useState("勇者啊... 部落的色彩正在消逝...");
  
  // Animation states
  const [potAnimation, setPotAnimation] = useState("");

  const addToPot = (ing: Ingredient) => {
    if (isCooking) return;
    if (pot.length >= 3) {
      setMessage("鍋子滿了！");
      return;
    }
    setPot([...pot, ing]);
    setMessage(`加入了 ${INGREDIENTS.find(i => i.id === ing)?.name}`);
  };

  const clearPot = () => {
    if (isCooking) return;
    setPot([]);
    setMessage("鍋子清空了。");
  };

  const cook = () => {
    if (pot.length === 0) return;
    setIsCooking(true);
    setMessage("烹飪中...");
    setPotAnimation("animate-bounce");

    // Cooking Simulation Delay
    setTimeout(() => {
      setIsCooking(false);
      setPotAnimation("");
      checkResult();
    }, 2000);
  };

  const checkResult = () => {
    const has = (id: Ingredient) => pot.includes(id);
    const count = pot.length;

    // --- PUZZLE 1: BRIDGE (Need Strength) ---
    if (puzzleStage === 1) {
      if (has('ramie') && has('shulang') && has('ash') && count === 3) {
        setMessage("大成功！【強化紅繩】<br>經過草木灰漂白與薯榔染色，纖維結構最為強韌。吊橋修復了！");
        setPot([]);
        setTimeout(() => setPuzzleStage(2), 2500);
      } else if (has('ramie') && has('shulang') && !has('ash')) {
        setMessage("失敗...【普通紅繩】<br>雖然有顏色，但未經漂白處理，纖維強度不足以支撐吊橋。");
      } else if (has('ramie') && has('ash') && !has('shulang')) {
        setMessage("失敗...【漂白白繩】<br>雖然乾淨，但缺乏單寧酸的補強，強度不如染色線。");
      } else {
        setMessage("失敗...【微妙的料理】<br>這似乎不能拿來修橋。");
      }
    }
    
    // --- PUZZLE 2: WALL (Need Acid) ---
    else if (puzzleStage === 2) {
      if (has('acid') && count === 1) {
        setMessage("大成功！【顯影酸液】<br>潑灑在牆上... 紅色的字跡浮現了！<br>『唯有酸能讓花青素顯色』");
        setPot([]);
        setTimeout(() => setPuzzleStage(3), 2500);
      } else if (has('ash')) {
        setMessage("失敗... 鹼性物質只會讓字跡變得更藍更暗。");
      } else {
        setMessage("無效。牆壁沒有反應。");
      }
    }

    // --- PUZZLE 3: CAPE (Need Black) ---
    else if (puzzleStage === 3) {
      if (has('ramie') && has('shulang') && has('mud') && count === 3) {
        setMessage("大成功！【尊爵黑布】<br>單寧酸(薯榔) + 鐵離子(黑泥) = 黑色錯合物。<br>這是祖靈最深沉的榮耀。");
        onSaveAnswer("Dye Level Completed: Bridge(Strength), Wall(pH), Cape(Iron)");
        // Transition to Knowledge Phase instead of completing immediately
        setTimeout(() => {
            setPhase('knowledge');
        }, 2000);
      } else if (has('ramie') && has('shulang') && !has('mud')) {
        setMessage("失敗... 只有薯榔只能染出褐色，頭目需要的是『黑色』。");
      } else if (has('mud') && !has('shulang')) {
        setMessage("失敗... 只有泥巴只會把線弄髒，沒有化學反應發生。");
      } else {
        setMessage("失敗... 這不是頭目要的顏色。");
      }
    }
  };

  const handleFinalComplete = () => {
      onSuccessMsg("色彩鍊金術師！<br>你找回了大地色彩背後的科學真理。");
      onComplete();
  };

  if (phase === 'knowledge') {
      return (
        <div className="space-y-8 max-w-5xl mx-auto animate-[fadeIn_0.8s_ease-out] pb-10">
            {/* Knowledge Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-amber-400 font-serif tracking-widest flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl">menu_book</span>
                    原科解密：我們的尋找
                </h2>
                <p className="text-slate-400 mt-2 text-lg">從四個問題開始，展開傳統與科學的對話</p>
            </div>

            {/* Part 1: Four Questions (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "苧麻處理", sub: "Ramie Processing", q: "祖先如何將植物變成可用的線材？", icon: "gesture", color: "text-emerald-400" },
                    { title: "草木灰漂白", sub: "Ash Bleaching", q: "傳說中的漂白法，最佳的比例是什麼？", icon: "science", color: "text-gray-400" },
                    { title: "薯榔染色", sub: "Dioscorea Dyeing", q: "如何重現最飽和、最持久的色彩？", icon: "palette", color: "text-red-400" },
                    { title: "纖維性能", sub: "Fiber Properties", q: "這些傳統工序，如何影響苧麻的耐用度？", icon: "fitness_center", color: "text-orange-400" },
                ].map((item, idx) => (
                    <div key={idx} className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 hover:border-slate-500 transition-all group">
                        <div className={`text-4xl mb-4 ${item.color} group-hover:scale-110 transition-transform origin-left`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <h3 className="font-bold text-slate-200 text-xl">{item.title}</h3>
                        <p className="text-xs text-slate-500 font-mono uppercase mb-3">{item.sub}</p>
                        <p className="text-base text-slate-400 leading-relaxed">{item.q}</p>
                    </div>
                ))}
            </div>

            {/* Part 2: Tradition vs Science (Comparison Table) */}
            <div className="bg-slate-900 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Header Left */}
                    <div className="bg-amber-900/30 p-5 text-center border-b md:border-b-0 md:border-r border-slate-700">
                        <h3 className="text-2xl font-bold text-amber-500 font-serif">Vuvu 的智慧</h3>
                        <p className="text-sm text-amber-500/50 uppercase tracking-widest mt-1">Tradition</p>
                    </div>
                    {/* Header Right */}
                    <div className="bg-cyan-900/30 p-5 text-center">
                        <h3 className="text-2xl font-bold text-cyan-400 font-serif">科學的語言</h3>
                        <p className="text-sm text-cyan-500/50 uppercase tracking-widest mt-1">Science</p>
                    </div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-800">
                    {[
                        { vuvu: "「要用草木灰漂白。」", sci: "鹼性溶液去除木質素，提升染色效率，同時也是定色的媒染劑。", icon: "water_ph" },
                        { vuvu: "「要用熱水煮薯榔。」", sci: "加熱加速單寧酸釋放，60分鐘可達最佳色彩飽和度。", icon: "heat" },
                        { vuvu: "「染色後比較耐用。」", sci: "單寧酸與纖維素產生交聯 (Cross-linking)，補強因漂白而受損的纖維結構。", icon: "link" },
                    ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center relative group hover:bg-white/5 transition-colors">
                            {/* Vuvu Content */}
                            <div className="p-8 text-center md:text-right text-amber-100 font-serif text-xl italic border-r border-slate-800/0 md:border-slate-800">
                                {row.vuvu}
                            </div>
                            
                            {/* Arrow / Icon */}
                            <div className="flex justify-center items-center py-2 md:py-0 relative">
                                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center z-10">
                                    <span className="material-symbols-outlined text-slate-400 text-2xl">{row.icon}</span>
                                </div>
                                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-700 -z-0 hidden md:block"></div>
                            </div>

                            {/* Science Content */}
                            <div className="p-8 text-center md:text-left text-cyan-100 border-l border-slate-800/0 md:border-slate-800 leading-relaxed text-base">
                                {row.sci}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-center pt-8">
                <button 
                    onClick={handleFinalComplete}
                    className="px-12 py-5 bg-gradient-to-r from-pink-700 to-purple-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all transform hover:scale-105 flex items-center gap-3"
                >
                    <span className="material-symbols-outlined">verified</span>
                    將知識收錄至希卡石板 (Finish)
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      {/* Header / Story */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-pink-400 font-serif tracking-widest">祖靈之息：色彩鍊金術師</h2>
        <div className="flex justify-center items-center gap-2 mt-2">
            <span className={`h-3 w-3 rounded-full ${puzzleStage >= 1 ? 'bg-pink-500' : 'bg-slate-700'}`}></span>
            <span className="w-10 h-0.5 bg-slate-700"></span>
            <span className={`h-3 w-3 rounded-full ${puzzleStage >= 2 ? 'bg-pink-500' : 'bg-slate-700'}`}></span>
            <span className="w-10 h-0.5 bg-slate-700"></span>
            <span className={`h-3 w-3 rounded-full ${puzzleStage >= 3 ? 'bg-pink-500' : 'bg-slate-700'}`}></span>
        </div>
        <div className="bg-slate-900/80 border border-pink-500/30 p-6 rounded-lg mt-4 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
            <p className="text-slate-300 text-base md:text-lg font-mono leading-relaxed" dangerouslySetInnerHTML={{__html: 
                puzzleStage === 1 ? "任務：部落的吊橋斷了！<br>普通的苧麻繩太脆。請合成出<b>最強韌</b>的繩索來修復它。<br><span class='text-sm text-pink-400'>(提示：報告指出漂白能去雜質，染色能補強結構)</span>" :
                puzzleStage === 2 ? "任務：石壁上有隱形的祖靈暗號。<br>提示寫著：『酸甜苦辣，唯有<b>酸</b>能顯影』。<br>請製作顯影藥劑。" :
                "任務：頭目需要一件象徵尊貴的<b>純黑披風</b>。<br>薯榔是紅褐色的... 要加入什麼才能變黑？<br><span class='text-sm text-pink-400'>(提示：尋找黑泥沼澤)</span>"
            }}></p>
        </div>
      </div>

      {/* Cooking Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        
        {/* Left: The Pot */}
        <div className="relative flex flex-col items-center justify-center min-h-[380px] bg-slate-900 rounded-xl border-2 border-pink-900/50 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
            {/* Fire */}
            <div className="absolute bottom-24 animate-pulse text-orange-500 opacity-80">
                <span className="material-symbols-outlined text-6xl">local_fire_department</span>
            </div>
            {/* Pot */}
            <div className={`relative z-10 w-48 h-40 bg-slate-800 rounded-b-[4rem] rounded-t-lg border-x-4 border-b-4 border-slate-600 flex items-center justify-center overflow-hidden ${potAnimation}`}>
                <div className="absolute inset-x-2 top-4 bottom-2 bg-pink-900/20 rounded-b-[3rem]"></div>
                {/* Items in Pot */}
                <div className="flex gap-1 flex-wrap justify-center p-4 z-20">
                    {pot.map((ing, i) => (
                        <span key={i} className={`material-symbols-outlined text-3xl animate-[bounce_1s_infinite] ${INGREDIENTS.find(x=>x.id===ing)?.color}`} style={{animationDelay: `${i*0.1}s`}}>
                            {INGREDIENTS.find(x=>x.id===ing)?.icon}
                        </span>
                    ))}
                </div>
            </div>
            {/* Lid / Cooking Text */}
            {isCooking && (
                <div className="absolute z-30 text-pink-400 font-bold text-2xl tracking-widest bg-black/80 px-4 py-2 rounded animate-pulse">
                    烹飪中...
                </div>
            )}
            {/* Message Log */}
            <div className="absolute top-4 w-full px-4 text-center">
                <div className="bg-black/60 text-slate-200 text-base py-3 px-6 rounded border border-slate-700 backdrop-blur-sm inline-block" dangerouslySetInnerHTML={{__html: message}}></div>
            </div>
            
            <div className="absolute bottom-6 flex gap-4">
                <button onClick={clearPot} className="px-6 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded border border-red-900/50">清空</button>
                <button 
                    onClick={cook} 
                    disabled={isCooking || pot.length === 0}
                    className={`px-8 py-3 font-bold rounded flex items-center gap-2 text-lg ${isCooking || pot.length === 0 ? 'bg-slate-700 text-slate-500' : 'bg-pink-700 hover:bg-pink-600 text-white shadow-lg'}`}
                >
                    <span className="material-symbols-outlined">soup_kitchen</span>
                    開始烹飪
                </button>
            </div>
        </div>

        {/* Right: Inventory */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase font-bold mb-4 tracking-widest border-b border-slate-600 pb-2">素材背包 (Inventory)</h3>
            <div className="grid grid-cols-3 gap-4">
                {INGREDIENTS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => addToPot(item.id)}
                        disabled={isCooking}
                        className="flex flex-col items-center gap-2 p-4 bg-slate-900 rounded-lg border border-slate-600 hover:border-pink-500 hover:bg-slate-800 transition-all active:scale-95 group"
                    >
                        <div className={`w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-pink-500/50 shadow-inner`}>
                            <span className={`material-symbols-outlined text-3xl ${item.color}`}>{item.icon}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-bold text-slate-200 block">{item.name}</span>
                            <span className="text-xs text-slate-500 block mt-1">{item.desc}</span>
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Hint Area */}
            <div className="mt-6 p-5 bg-slate-900/50 rounded border border-slate-700/50 text-sm text-slate-400">
                <strong className="text-pink-400 block mb-2 text-base">希卡圖鑑筆記：</strong>
                <ul className="list-disc pl-5 space-y-2">
                    <li><b>草木灰 (Ash)</b>：強鹼性。能去除雜質(漂白)，也能加深薯榔顏色。</li>
                    <li><b>黑泥 (Mud)</b>：富含鐵質。與單寧酸結合會產生沈澱。</li>
                    <li><b>薯榔 (Shulang)</b>：富含單寧酸的紅色染料。</li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dye;
