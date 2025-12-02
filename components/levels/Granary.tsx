
import React, { useState, useEffect, useRef } from 'react';

interface GranaryProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

type MaterialType = 'wood' | 'slate' | 'metal';

const MATERIALS: Record<MaterialType, { name: string; frictionDesc: string; criticalAngle: number; texture: string; color: string }> = {
  wood: { 
    name: '粗糙木材 (Wood)', 
    frictionDesc: '高摩擦力 (High Friction)', 
    criticalAngle: 65, 
    texture: 'repeating-linear-gradient(45deg, #78350f 0px, #92400e 10px)',
    color: 'bg-amber-800'
  },
  slate: { 
    name: '磨光石板 (Slate)', 
    frictionDesc: '中摩擦力 (Medium Friction)', 
    criticalAngle: 45, 
    texture: 'repeating-linear-gradient(90deg, #475569 0px, #64748b 20px)',
    color: 'bg-slate-600'
  },
  metal: { 
    name: '光滑鐵皮 (Metal)', 
    frictionDesc: '低摩擦力 (Low Friction)', 
    criticalAngle: 30, 
    texture: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
    color: 'bg-gray-300'
  }
};

// Procedural Sound Generator
const playSound = (type: 'ratchet' | 'squeak' | 'slip' | 'climb') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'ratchet') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'squeak') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1500, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'slip') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'climb') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};

const Granary: React.FC<GranaryProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer }) => {
  const [angle, setAngle] = useState(20); // Initial angle
  const [material, setMaterial] = useState<MaterialType>('wood');
  const [isSimulating, setIsSimulating] = useState(false);
  const [ratProgress, setRatProgress] = useState(0); 
  const [ratStatus, setRatStatus] = useState<'idle' | 'climbing' | 'hanging' | 'slipped' | 'success'>('idle');
  const [feedback, setFeedback] = useState("請調整防鼠板的角度與材質。");
  
  const lastSoundTime = useRef(0);

  useEffect(() => {
    if (!isSimulating) {
      setRatProgress(0);
      setRatStatus('idle');
      setFeedback("準備測試...");
    }
  }, [angle, material, isSimulating]);

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSimulating) return;
    const newAngle = parseInt(e.target.value);
    setAngle(newAngle);
    
    const now = Date.now();
    if (now - lastSoundTime.current > 50) {
        playSound('ratchet');
        lastSoundTime.current = now;
    }
  };

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setRatStatus('climbing');
    setFeedback("老鼠開始攀爬支柱...");
    playSound('squeak');

    let p = 0;
    const interval = setInterval(() => {
      p += 1.5;
      setRatProgress(p);
      
      // Phase 1: Climbing the vertical pole (0-50%)
      if (p < 50) {
         if (Math.floor(p) % 10 === 0) playSound('climb');
      } 
      // Phase 2: Reaching the Yulu (Rat Guard) (50-60%)
      else if (p >= 50 && p < 60) {
         setRatStatus('hanging');
         setFeedback("老鼠遭遇防鼠板 (Yulu)，嘗試倒掛突破...");
      }
      // Phase 3: Evaluation Point (60%)
      else if (p >= 60) {
         clearInterval(interval);
         evaluateOutcome();
      }
    }, 30);
  };

  const evaluateOutcome = () => {
    const critical = MATERIALS[material].criticalAngle;
    
    // Outcome Logic: 
    // If the board is steep enough (angle > critical), gravity overcomes friction -> Rat slips.
    
    setTimeout(() => {
      if (angle >= critical) {
        setRatStatus('slipped');
        playSound('slip');
        setFeedback(`防禦成功！${MATERIALS[material].name} 表面太滑，且角度(${angle}°)夠陡，老鼠抓不住！`);
        
        setTimeout(() => {
            onSaveAnswer(`Material: ${material}, Critical: ${critical}, Angle: ${angle}`);
            onSuccessMsg(`<b>防鼠板 (Yulu) 驗證成功！</b><br>
            你發現了原住民的科學智慧：<br>
            1. <b>材質影響摩擦力</b>：越光滑的表面(如石板)，需要的角度越小。<br>
            2. <b>斜面分力</b>：當角度超過「臨界角」，重力分量 > 最大靜摩擦力，老鼠就會滑落。`);
            onComplete();
        }, 2000);
      } else {
        setRatStatus('success');
        playSound('squeak');
        let msg = "";
        if (material === 'wood') msg = "失敗！木頭表面太粗糙，老鼠指甲能輕易勾住，需要更陡的角度！";
        else msg = `失敗！角度 ${angle}° 太過平緩，老鼠利用核心肌群撐過去了！`;
        
        setFeedback(msg);
        setTimeout(() => {
            onFail(msg);
            setIsSimulating(false);
        }, 2000);
      }
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-yellow-400 font-serif tracking-widest flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl">home_work</span>
          會呼吸的穀倉：防鼠板試煉
        </h2>
        <p className="text-yellow-500/60 text-xs uppercase tracking-[0.3em] mt-2">The Physics of Yulu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- SIMULATION VIEW --- */}
        <div className="bg-slate-900 border-4 border-slate-700 rounded-xl relative h-[450px] overflow-hidden shadow-2xl group select-none">
            {/* Background: Blueprint Grid + Sky */}
            <div className="absolute inset-0 bg-slate-950">
                 <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#fbbf24_1px,transparent_1px),linear-gradient(90deg,#fbbf24_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
                
                {/* 1. The Granary (Khu) - Top Section */}
                <div className="relative z-30 mb-[-10px] transform hover:scale-[1.02] transition-transform">
                    {/* Roof (Thatched Style) */}
                    <div className="w-64 h-24 bg-gradient-to-b from-yellow-900 to-yellow-800 rounded-t-[3rem] relative overflow-hidden shadow-lg border-b-4 border-yellow-950">
                        {/* Thatch Texture */}
                        <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#000_5px)]"></div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-2 bg-black/20 rounded-full"></div>
                    </div>
                    {/* Main Body (Bamboo/Wood Slats) */}
                    <div className="w-56 h-32 mx-auto bg-amber-900 relative border-x-4 border-amber-950 flex items-center justify-center">
                        {/* Slats Texture */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#78350f, #78350f_10px, #451a03_12px)] opacity-80"></div>
                        {/* Door */}
                        <div className="w-16 h-24 bg-black/40 border-2 border-amber-700 relative z-10 flex items-center justify-center">
                             <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg ml-8"></div>
                        </div>
                    </div>
                    {/* Floor Base (Visible part of the floor) */}
                    <div className="w-72 h-4 bg-stone-800 mx-auto rounded-full shadow-xl relative z-30"></div>
                </div>

                {/* 2. The Rat Guard (Yulu) - The Physics Object */}
                {/* z-20 puts it BEHIND the z-30 floor, creating the effect of being underneath. 
                    Increased width (w-40) ensures it sticks out past the w-72 floor. */}
                <div className="relative z-20 w-full flex justify-center h-0 items-start -top-4">
                     {/* The Yulu Board (Inverted Funnel Shape /\) */}
                     {/* 
                         Left Slope: Origin Right, rotate -angle (Counter-Clockwise) -> Tips down-left
                         Right Slope: Origin Left, rotate +angle (Clockwise) -> Tips down-right
                     */}
                     <div className="relative">
                         {/* Left Slope */}
                         <div 
                            className={`absolute top-0 right-0 w-40 h-5 origin-right rounded-l-md shadow-xl border-y border-l border-black/50 transition-transform duration-500`}
                            style={{ 
                                transform: `rotate(-${angle}deg)`, 
                                background: MATERIALS[material].texture,
                            }}
                         ></div>
                         {/* Right Slope */}
                         <div 
                            className={`absolute top-0 left-0 w-40 h-5 origin-left rounded-r-md shadow-xl border-y border-r border-black/50 transition-transform duration-500`}
                            style={{ 
                                transform: `rotate(${angle}deg)`,
                                background: MATERIALS[material].texture,
                            }}
                         ></div>
                         
                         {/* Connection Joint */}
                         <div className="absolute -top-1 -left-4 w-8 h-6 bg-stone-900 rounded-full z-20 shadow-md"></div>
                     </div>
                </div>

                {/* 3. The Pillar (Post) - High Stilt */}
                <div className="w-12 h-64 bg-[#5d4037] border-x-2 border-black/50 relative z-10 flex justify-center shadow-inner">
                    {/* Wood Texture */}
                    <div className="w-px h-full bg-black/20 mx-2"></div>
                    <div className="w-px h-full bg-black/20 mx-1"></div>
                </div>

                {/* 4. The Rat Animation */}
                <div 
                    className="absolute z-30 transition-all duration-75"
                    style={{
                        bottom: ratStatus === 'slipped' ? '0px' : ratStatus === 'success' ? '300px' : `${Math.min(260, ratProgress * 4.5)}px`,
                        left: ratStatus === 'slipped' ? '30%' : '50%',
                        transform: `
                           translateX(-50%) 
                           ${ratStatus === 'hanging' ? 'rotate(180deg) translateY(-20px)' : ''}
                           ${ratStatus === 'slipped' ? 'rotate(135deg)' : ''}
                           ${ratStatus === 'success' ? 'scale(1.2)' : 'scale(1)'}
                        `,
                        opacity: ratStatus === 'success' && ratProgress < 100 ? 1 : 1
                    }}
                >
                    <div className={`relative ${ratStatus === 'climbing' ? 'animate-[bounce_0.1s_infinite]' : ''}`}>
                        <span className="material-symbols-outlined text-4xl text-stone-300 drop-shadow-md filter brightness-110">pest_control_rodent</span>
                        
                        {/* Status Effects */}
                        {ratStatus === 'success' && (
                            <div className="absolute -top-10 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-bounce">入侵成功!</div>
                        )}
                        {ratStatus === 'slipped' && (
                            <div className="absolute -top-10 left-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded animate-ping">滑落!</div>
                        )}
                    </div>
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-8 bg-stone-900 border-t-4 border-stone-800 z-10"></div>
            </div>

            {/* Angle Indicator */}
            <div className="absolute top-4 left-4 font-mono text-yellow-400 text-base bg-black/80 px-4 py-2 rounded border-l-4 border-yellow-500 shadow-lg z-40">
                <div className="text-[10px] text-slate-400 uppercase">Current Angle</div>
                <div className="text-2xl font-bold">{angle}°</div>
            </div>
        </div>

        {/* --- CONTROLS --- */}
        <div className="flex flex-col space-y-6">
            
            {/* Intro Text */}
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
                    <span className="material-symbols-outlined text-yellow-500 text-2xl">lightbulb</span>
                    智慧的藍圖
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                    泰雅族的穀倉 (Khu) 採高架設計，支柱頂端安裝了倒扣的木板或石板，稱為 <b>Yulu (防鼠板)</b>。<br/>
                    這是一個精密的物理裝置：利用<b>材質的低摩擦力</b>與<b>傾斜角度</b>，讓老鼠無法對抗重力而滑落。
                </p>
            </div>

            {/* Controls Container */}
            <div className="bg-black/40 p-6 rounded-xl border border-slate-700/50 space-y-6">
                
                {/* 1. Material */}
                <div>
                    <label className="text-yellow-400 font-bold mb-3 block text-base">Step 1: 選擇防鼠板材質</label>
                    <div className="grid grid-cols-3 gap-3">
                        {(Object.keys(MATERIALS) as MaterialType[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => !isSimulating && setMaterial(m)}
                                disabled={isSimulating}
                                className={`p-3 rounded border transition-all flex flex-col items-center gap-1 text-center
                                    ${material === m 
                                        ? `bg-slate-700 border-yellow-500 ring-1 ring-yellow-500/50` 
                                        : 'bg-slate-800 border-slate-600 opacity-60 hover:opacity-100'}
                                `}
                            >
                                <div className={`w-full h-10 rounded ${MATERIALS[m].color} mb-1 shadow-inner opacity-80`}></div>
                                <span className="text-sm font-bold text-white">{MATERIALS[m].name.split(' ')[0]}</span>
                                <span className="text-xs text-slate-400 scale-90">{MATERIALS[m].frictionDesc.split(' ')[0]}摩擦</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Angle */}
                <div>
                    <label className="flex justify-between text-yellow-400 font-bold mb-2 text-base">
                        <span>Step 2: 調整傾斜角度 (θ)</span>
                        <span className="font-mono text-white">{angle}°</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="80" 
                        step="5" 
                        value={angle}
                        onChange={handleAngleChange}
                        disabled={isSimulating}
                        className="w-full h-4 bg-slate-700 rounded-lg cursor-pointer accent-yellow-500 hover:accent-yellow-400"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono uppercase">
                        <span>Flat (0°)</span>
                        <span>Steep (80°)</span>
                    </div>
                </div>

                {/* Physics Note (Updated text) */}
                <div className="bg-yellow-900/20 p-4 rounded border-l-2 border-yellow-500">
                    <h4 className="text-yellow-200 font-bold text-sm mb-2">物理筆記：</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        老鼠要抓住板子，依靠的是<span className="text-white font-bold">摩擦力</span>。<br/>
                        當板子傾斜時，<span className="text-white font-bold">地心引力</span>會產生一個往下拉的分力。<br/>
                        當 <b>往下拉的力 &gt; 摩擦力</b> 時，老鼠就會滑落。<br/>
                        <span className="text-yellow-500/80 mt-1 block">提示：越滑的材質，需要的角度越小；越粗糙的材質，需要越陡峭的角度。</span>
                    </p>
                </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
                <div className="text-base text-emerald-400 mb-3 min-h-[1.5em] font-bold animate-pulse font-mono">{feedback}</div>
                <button 
                    onClick={startSimulation}
                    disabled={isSimulating}
                    className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                        ${isSimulating 
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-yellow-700 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-500 border border-yellow-500/50'}
                    `}
                >
                    {isSimulating ? '測試進行中...' : '開始防鼠測試'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Granary;
