import React from 'react';

interface HeaderProps {
  teamName: string;
  progress: number;
}

const Header: React.FC<HeaderProps> = ({ teamName, progress }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur border-b border-amber-900/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center border border-amber-500/30">
            <span className="material-symbols-outlined text-amber-500">science</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-500 tracking-wider">原科解密</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">失落的變因</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <div className="text-[10px] text-slate-500 uppercase">探索小隊</div>
            <div className="text-sm text-emerald-400 font-mono tracking-widest">{teamName || '等待登錄...'}</div>
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-amber-700 to-amber-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;