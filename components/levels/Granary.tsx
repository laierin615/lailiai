
import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../../constants';

interface GranaryProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

type MaterialType = 'wood' | 'slate' | 'metal';

const MATERIALS: Record<MaterialType, { name: string; frictionDesc: string; criticalAngle: number; style: string; border: string; shadow: string }> = {
  wood: { 
    name: '木材 (Wood)', 
    frictionDesc: '高 (High Friction)', 
    criticalAngle: 60, 
    style: 'bg-amber-600', 
    border: 'border-amber-800',
    shadow: 'shadow-amber-900/50'
  },
  slate: { 
    name: '石板 (Slate)', 
    frictionDesc: '中 (Medium Friction)', 
    criticalAngle: 50, 
    style: 'bg-slate-500', 
    border: 'border-slate-700',
    shadow: 'shadow-slate-900/50'
  },
  metal: { 
    name: '鐵皮 (Metal)', 
    frictionDesc: '低 (Low Friction)', 
    criticalAngle: 40, 
    style: 'bg-gray-300', 
    border: 'border-gray-500',
    shadow: 'shadow-white/20'
  }
};

// Procedural Sound Generator to avoid external assets
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
      // Mechanical Click for Slider
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'squeak') {
      // Rat Squeak
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1500, now + 0.1);
      osc.frequency.linearRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'slip') {
      // Sliding down sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'climb') {
      // Scuttling sound (noise burst simulated)
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
  const [angle, setAngle] = useState(15); // Initial angle (degrees)
  const [material, setMaterial] = useState<MaterialType>('wood');
  const [isSimulating, setIsSimulating] = useState(false);
  const [ratPosition, setRatPosition] = useState(0); // 0: bottom, 100: top of guard
  const [ratStatus, setRatStatus] = useState<'idle' | 'climbing' | 'slipped' | 'success'>('idle');
  const [feedback, setFeedback] = useState("請選擇材質並調整角度。");
  
  // Ref for sound throttling
  const lastSoundTime = useRef(0);

  // Reset simulation when angle/material changes
  useEffect(() => {
    if (!isSimulating) {
      setRatPosition(0);
      setRatStatus('idle');
      setFeedback("準備測試...");
    }
  }, [angle, material, isSimulating]);

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSimulating) return;
    const newAngle = parseInt(e.target.value);
    setAngle(newAngle);
    
    // Throttle sound effect to avoid spamming
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
    setFeedback("老鼠正在嘗試攀爬...");
    playSound('squeak');

    // Animation Logic
    let progress = 0;
    let stepCount = 0;
    
    const interval = setInterval(() => {
      progress += 2;
      stepCount++;
      setRatPosition(progress);
      
      // Play scuttling sound occasionally
      if (stepCount % 5 === 0) playSound('climb');

      // Reached the critical point (under the guard)
      if (progress >= 75) { // Adjusted threshold for visual alignment
        clearInterval(interval);
        evaluateOutcome();
      }
    }, 40);
  };

  const evaluateOutcome = () => {
    // Physics Logic based on Science Fair Report:
    // Condition for slipping: tan(theta) > static_friction_coefficient (mu)
    // We map this to critical angles.
    const critical = MATERIALS[material].criticalAngle;
    
    setTimeout(() => {
      if (angle >= critical) {
        // Success: Rat slips
        setRatStatus('slipped');
        playSound('slip');
        setFeedback(`防禦成功！${MATERIALS[material].name} 表面較滑，${angle}° 足以讓老鼠滑落！`);
        setTimeout(() => {
            onSaveAnswer(`Material: ${material}, Critical Angle: ${critical}, User Angle: ${angle}`);
            onSuccessMsg(`<b>防鼠板 (Yulu) 測試成功！</b><br>
            你發現了材質與角度的關係：<br>
            表面越光滑（摩擦係數 $\\mu$ 越小），所需的臨界角度就越小。<br>
            泰雅族傳統使用木材，因此需要較大的角度 (約60°)。`);
            onComplete();
        }, 1500);
      } else {
        // Fail: Rat climbs over
        setRatStatus('success'); // Rat success = Player fail
        playSound('squeak');
        
        let msg = "";
        if (angle < critical - 20) msg = "失敗！角度太過平緩，老鼠輕鬆爬過。";
        else msg = `失敗！對於 ${MATERIALS[material].name} 來說，這個角度還不夠陡。`;
        
        setFeedback(msg);
        setTimeout(() => {
            onFail(msg);
            setIsSimulating(false);
        }, 1500);
      }
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-yellow-400 font-serif tracking-widest flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl">home_work</span>
          會呼吸的穀倉：防鼠板試煉
        </h2>
        <p className="text-yellow-500/60 text-xs uppercase tracking-[0.3em] mt-2">The Physics of Yulu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Simulation View */}
        <div className="bg-slate-900 border-2 border-yellow-900/50 rounded-xl relative h-[400px] overflow-hidden shadow-2xl group select-none">
            {/* Background Grid for Blueprint effect */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#fbbf24_1px,transparent_1px),linear-gradient(90deg,#fbbf24_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
                
                {/* Granary House (Top) */}
                <div className="w-64 h-32 bg-slate-800 border-2 border-yellow-700/50 rounded-lg mb-0 relative z-20 flex items-center justify-center shadow-lg">
                    <div className="text-center">
                        <span className="text-yellow-500/50 font-bold text-2xl uppercase tracking-widest block">Khu</span>
                        <span className="text-[10px] text-slate-500">FOOD STORAGE</span>
                    </div>
                    {/* Food inside */}
                    <div className="absolute w-full h-1 bottom-0 bg-yellow-900/50"></div>
                </div>

                {/* The Rat Guard (Yulu) - Dynamic Angle & Material */}
                <div className="relative z-10 w-full flex justify-center h-0">
                    {/* Left Wing */}
                    <div 
                        className={`absolute top-0 right-[50%] w-28 h-4 origin-right rounded-l-full border-y border-l shadow-md ${MATERIALS[material].style} ${MATERIALS[material].border} ${MATERIALS[material].shadow}`}
                        style={{ 
                            transform: `rotate(${angle}deg)`,
                            transition: isSimulating ? 'transform 0.5s ease-in' : 'none'
                        }}
                    ></div>
                    {/* Right Wing */}
                    <div 
                        className={`absolute top-0 left-[50%] w-28 h-4 origin-left rounded-r-full border-y border-r shadow-md ${MATERIALS[material].style} ${MATERIALS[material].border} ${MATERIALS[material].shadow}`}
                        style={{ 
                            transform: `rotate(-${angle}deg)`,
                            transition: isSimulating ? 'transform 0.5s ease-in' : 'none'
                        }}
                    ></div>
                </div>

                {/* The Pillar (Post) */}
                <div className="w-12 h-48 bg-stone-700 border-x border-stone-600 relative z-0 flex justify-center">
                    {/* Wood Texture */}
                    <div className="w-px h-full bg-stone-800/50 mx-1"></div>
                    <div className="w-px h-full bg-stone-800/50 mx-1"></div>
                </div>

                {/* The Rat */}
                <div 
                    className="absolute z-20 transition-all duration-75 ease-linear"
                    style={{
                        bottom: '40px', // Ground level offset
                        transform: `translateY(-${ratPosition * 2.2}px) translateX(${ratStatus === 'slipped' ? '60px' : '0px'}) rotate(${ratStatus === 'slipped' ? '180deg' : '0deg'})`,
                        opacity: ratStatus === 'success' ? 0 : 1
                    }}
                >
                    <div className={`relative ${ratStatus === 'climbing' ? 'animate-[bounce_0.2s_infinite]' : ''}`}>
                        <span className="material-symbols-outlined text-4xl text-stone-300 drop-shadow-lg filter brightness-125">pest_control_rodent</span>
                        {ratStatus === 'success' && (
                            <div className="absolute -top-8 left-0 text-emerald-400 font-bold animate-ping text-sm">YUM!</div>
                        )}
                        {ratStatus === 'slipped' && (
                            <div className="absolute -top-8 left-0 text-red-400 font-bold animate-ping text-sm">SLIP!</div>
                        )}
                        {/* Sound Effect Visual Indicator */}
                        {isSimulating && ratStatus === 'climbing' && (
                            <span className="absolute -right-4 -top-2 text-[10px] text-yellow-300 animate-pulse font-bold">squeak!</span>
                        )}
                    </div>
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-10 bg-stone-800 border-t-4 border-stone-700"></div>
            </div>

            {/* Angle Indicator Overlay */}
            <div className="absolute top-4 left-4 font-mono text-yellow-400 text-sm bg-black/60 px-3 py-1 rounded border border-yellow-500/30 shadow-lg">
                ANGLE: {angle}°
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-center space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
            
            {/* 1. Material Selector */}
            <div>
                <label className="text-yellow-400 font-bold mb-3 block flex items-center gap-2">
                    <span className="material-symbols-outlined">layers</span> 
                    防鼠板材質 (Material)
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(MATERIALS) as MaterialType[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => !isSimulating && setMaterial(m)}
                            disabled={isSimulating}
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1
                                ${material === m 
                                    ? `bg-slate-700 ${MATERIALS[m].border} ring-1 ring-yellow-500/50` 
                                    : 'bg-slate-800 border-slate-700 opacity-60 hover:opacity-100'}
                            `}
                        >
                            <div className={`w-8 h-8 rounded-full ${MATERIALS[m].style} mb-1 shadow-sm`}></div>
                            <span className="text-xs font-bold text-white">{MATERIALS[m].name.split(' ')[0]}</span>
                            <span className="text-[9px] text-slate-400 scale-90">{MATERIALS[m].frictionDesc.split(' ')[0]}摩擦</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Angle Slider */}
            <div>
                <label className="flex justify-between text-yellow-400 font-bold mb-4 items-center">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined">tune</span> 防鼠板角度 (Angle)</span>
                    <span className="text-3xl font-mono text-white drop-shadow-md">{angle}°</span>
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="80" 
                    step="5" 
                    value={angle}
                    onChange={handleAngleChange}
                    disabled={isSimulating}
                    className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono uppercase tracking-wide">
                    <span>Flat (0°)</span>
                    <span>Steep (80°)</span>
                </div>
            </div>

            {/* Physics Note */}
            <div className="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500/50">
                <h4 className="text-yellow-200 font-bold text-sm mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">science</span> 
                    物理筆記
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                    臨界條件：$\tan(\theta) &gt; \mu_s$ (靜摩擦係數)。<br/>
                    材質越滑 ($\mu_s$ 越小)，所需的角度 $\theta$ 就越小。<br/>
                    <span className="text-yellow-500/80">提示：鐵皮比木頭滑很多。</span>
                </p>
            </div>

            <div className="text-center">
                <div className="text-sm text-slate-300 mb-4 min-h-[1.5em] font-bold animate-pulse">{feedback}</div>
                <button 
                    onClick={startSimulation}
                    disabled={isSimulating}
                    className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                        ${isSimulating 
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-yellow-700 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-500 border border-yellow-500/50 hover:shadow-yellow-500/20'}
                    `}
                >
                    {isSimulating ? (
                        <>
                            <span className="material-symbols-outlined animate-spin">settings</span>
                            模擬進行中...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">play_circle</span>
                            開始測試 (Test)
                        </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Granary;
    