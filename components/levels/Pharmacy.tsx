import React from 'react';

interface PharmacyProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

const Pharmacy: React.FC<PharmacyProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer }) => {
  const handleChoice = (isCorrect: boolean) => {
    if (isCorrect) {
      onSaveAnswer("Alcohol extraction selected");
      onSuccessMsg("實驗成功！酒精成功萃取了脂溶性成分。");
      onComplete();
    } else {
      onFail("效果微弱... 水無法溶解關鍵成分。");
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-400 font-serif">智慧之泉：看不見的流動</h2>
        <p className="text-purple-500/60 text-xs uppercase tracking-[0.3em] mt-2">Spring of Wisdom</p>
      </div>
      <div className="bg-slate-900/80 p-8 rounded-xl border border-purple-900/50 max-w-2xl mx-auto text-center shadow-lg">
        <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-purple-900/20 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <span className="material-symbols-outlined text-6xl text-purple-400">science</span>
            </div>
        </div>
        <p className="text-slate-300 mb-6 font-serif">
          「實驗失敗：水煮石菖蒲無法抑制細菌。耆老說：『要用酒，酒才能引出它的靈魂。』」
        </p>
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleChoice(false)}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded text-left transition-colors border border-slate-700 flex items-center gap-4 group"
          >
            <span className="material-symbols-outlined text-blue-400 text-2xl group-hover:scale-110 transition-transform">water_drop</span>
            <div>
                <span className="font-bold text-white block">A. 用水煮 (極性溶劑)</span>
                <span className="text-xs text-slate-400">模擬傳統水煮法</span>
            </div>
          </button>
          <button 
            onClick={() => handleChoice(true)}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded text-left transition-colors border border-purple-500/50 hover:border-purple-400 flex items-center gap-4 group"
          >
            <span className="material-symbols-outlined text-purple-400 text-2xl group-hover:scale-110 transition-transform">liquor</span>
            <div>
                <span className="font-bold text-white block">B. 用酒精泡 (有機溶劑)</span>
                <span className="text-xs text-slate-400">模擬浸泡藥酒</span>
            </div>
          </button>
          <button 
            onClick={() => handleChoice(false)}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded text-left transition-colors border border-slate-700 flex items-center gap-4 group"
          >
            <span className="material-symbols-outlined text-slate-400 text-2xl group-hover:scale-110 transition-transform">pestle</span>
            <div>
                <span className="font-bold text-white block">C. 直接搗碎 (物理破壞)</span>
                <span className="text-xs text-slate-400">模擬外敷</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;