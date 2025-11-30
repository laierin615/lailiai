import React from 'react';

interface FinalProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

const Final: React.FC<FinalProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer }) => {
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      onSaveAnswer("Final: Correct Answer");
      onComplete();
    } else {
      onFail("回答錯誤。科學並非取代傳統，而是理解傳統的另一種語言。");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-center animate-[fadeIn_1s_ease-out]">
      <div>
        <span className="text-amber-500 text-xs tracking-[0.3em] uppercase border border-amber-500 px-3 py-1 rounded-full">Final Trial</span>
        <h2 className="text-4xl font-bold text-white mt-4 mb-2 font-serif">終焉之谷：傳承之火</h2>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-xl border-2 border-red-900/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900 via-slate-900 to-black"></div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="material-symbols-outlined text-8xl text-amber-500 mb-6 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse">local_fire_department</span>
          
          <h3 className="text-2xl font-bold text-red-400 mb-6 drop-shadow-lg">毒舌守門人的質問</h3>
          
          <div className="bg-black/60 p-6 rounded-lg text-left mb-8 border-l-4 border-red-500 backdrop-blur-sm w-full">
            <p className="text-slate-200 italic font-serif text-lg leading-relaxed">
              「你憑什麼說我們的文化是科學？用一句話說服我！」
            </p>
          </div>

          <div className="grid gap-4 text-left w-full">
            <button 
              onClick={() => handleAnswer(false)}
              className="p-5 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-all hover:translate-x-1"
            >
              A. 這是祖靈的規定，我們不需要科學來證明。
            </button>
            <button 
              onClick={() => handleAnswer(true)}
              className="p-5 bg-slate-800/90 hover:bg-slate-700 border border-emerald-500/50 hover:border-emerald-400 rounded-lg text-slate-300 hover:text-white transition-all ring-1 ring-emerald-500/20 hover:ring-emerald-400 hover:translate-x-1 shadow-lg"
            >
              B. 防鼠板利用<span className="text-emerald-400 font-bold mx-1">摩擦力</span>，燻飛魚利用<span className="text-emerald-400 font-bold mx-1">脫水原理</span>。這就是文化的科學邏輯。
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Final;