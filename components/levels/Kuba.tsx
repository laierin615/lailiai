
import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../../constants';

interface KubaProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
}

type Phase = 'intro' | 'scan' | 'defense';
type MaterialType = 'haingu' | 'veio' | 'ptiveo';

const MATERIALS: Record<MaterialType, { 
    name: string; 
    sciName: string; 
    desc: string; 
    waxLayer: 'High' | 'Medium' | 'Low'; 
    structure: string; 
    resilience: number; 
}> = {
  haingu: { 
      name: '五節芒 (Haingu)', 
      sciName: 'Miscanthus floridulus',
      desc: '鄒族傳統建材。葉背有厚蠟質，能有效疏水。', 
      waxLayer: 'High', 
      structure: '維管束極密',
      resilience: 1.5 
  },
  veio: { 
      name: '白芒 (Veio)', 
      sciName: 'Miscanthus sinensis',
      desc: '類似五節芒，但節間較長，蠟質層較薄。', 
      waxLayer: 'Medium', 
      structure: '維管束普通',
      resilience: 1.0 
  },
  ptiveo: { 
      name: '高山芒 (Ptiveo)', 
      sciName: 'Miscanthus transmorrisonensis',
      desc: '高海拔植物。質地較軟，易吸水腐爛。', 
      waxLayer: 'Low', 
      structure: '質地鬆軟',
      resilience: 0.5 
  },
};

const Kuba: React.FC<KubaProps> = ({ onComplete, onFail, onSuccessMsg, onSaveAnswer }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedMat, setSelectedMat] = useState<MaterialType | null>(null);
  
  // Game State
  const [fireLevel, setFireLevel] = useState(0); // 0, 1, 2
  const [humidity, setHumidity] = useState(60);
  const [temp, setTemp] = useState(25);
  const [integrity, setIntegrity] = useState(100);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<'none' | 'won' | 'lost'>('none');

  // Logic Refs to prevent stale closures in interval
  const stateRef = useRef({
    humidity: 60,
    temp: 25,
    integrity: 100,
    timeLeft: 30,
    fireLevel: 0,
    resilience: 1.0
  });

  // Sync state to ref
  useEffect(() => {
    stateRef.current.fireLevel = fireLevel;
  }, [fireLevel]);

  // Simulation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const current = stateRef.current;
      
      // 1. Time
      current.timeLeft -= 0.5;
      if (current.timeLeft <= 0) {
        setGameResult('won');
        setIsPlaying(false);
        clearInterval(timer);
        return;
      }

      // 2. Physics
      // Rain (+Humidity) vs Fire (-Humidity, +Temp)
      const rainForce = 3.5 / current.resilience; 
      const dryForce = current.fireLevel === 1 ? 3 : current.fireLevel === 2 ? 8 : 0;
      const heatForce = current.fireLevel * 3;
      const coolForce = 1.5;

      current.humidity = Math.min(100, Math.max(20, current.humidity + rainForce - dryForce));
      current.temp = Math.max(15, current.temp + heatForce - coolForce);

      // 3. Damage
      let damage = 0;
      if (current.humidity > 80) damage += 1.5; // Rot
      if (current.temp > 90) damage += 3; // Burn
      
      current.integrity = Math.max(0, current.integrity - damage);

      // 4. Update React State for UI
      setHumidity(current.humidity);
      setTemp(current.temp);
      setIntegrity(current.integrity);
      setTimeLeft(current.timeLeft);

      // 5. Fail Check
      if (current.integrity <= 0) {
        setGameResult('lost');
        setIsPlaying(false);
        clearInterval(timer);
        if (current.temp > 90) {
            onFail("失敗！溫度失控，Kuba 被燒毀了。請控制火侯。");
        } else {
            onFail("失敗！濕度過高，屋頂腐爛崩塌。請開火除濕。");
        }
      }
    }, 500);

    return () => clearInterval(timer);
  }, [isPlaying, onFail]);

  const startGame = () => {
    if (!selectedMat) return;
    // Reset
    stateRef.current = {
        humidity: 70,
        temp: 20,
        integrity: 100,
        timeLeft: 30,
        fireLevel: 0,
        resilience: MATERIALS[selectedMat].resilience
    };
    setHumidity(70);
    setTemp(20);
    setIntegrity(100);
    setTimeLeft(30);
    setFireLevel(0);
    setGameResult('none');
    setIsPlaying(true);
  };

  const handleWin = () => {
      onSaveAnswer(`Kuba: Mat=${selectedMat}`);
      onSuccessMsg("庫巴守護成功！<br>你成功運用了蠟質選材與熱對流原理。");
      onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out] pb-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-400 font-serif flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">roofing</span>
            庫巴的試煉
        </h2>
        <p className="text-red-500/60 text-xs tracking-widest uppercase">Kuba Defense</p>
      </div>

      {/* PHASE 1: INTRO */}
      {phase === 'intro' && (
          <div className="bg-slate-900 border border-red-900 p-8 rounded-xl text-center">
              <span className="material-symbols-outlined text-6xl text-red-500 mb-4">thunderstorm</span>
              <h3 className="text-xl text-white font-bold mb-2">災厄警報</h3>
              <p className="text-slate-400 mb-6">暴雨將至，Kuba 的屋頂岌岌可危。<br/>身為建築師，你必須選擇正確的茅草，並利用火堆控制濕度。</p>
              <button onClick={() => setPhase('scan')} className="px-6 py-2 bg-red-700 text-white rounded font-bold hover:bg-red-600">
                  開始選材
              </button>
          </div>
      )}

      {/* PHASE 2: SCAN */}
      {phase === 'scan' && (
          <div className="space-y-4">
              <p className="text-center text-slate-400">請選擇<span className="text-white font-bold">蠟質層最厚 (Wax: High)</span> 的材料。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(MATERIALS) as MaterialType[]).map(key => (
                      <button 
                        key={key}
                        onClick={() => setSelectedMat(key)}
                        className={`p-4 rounded-xl border-2 transition-all ${selectedMat === key ? 'border-amber-500 bg-slate-800' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
                      >
                          <div className="text-4xl mb-2 text-slate-500">
                             <span className="material-symbols-outlined">grass</span>
                          </div>
                          <div className="font-bold text-white text-lg">{MATERIALS[key].name}</div>
                          <div className="text-xs text-amber-500 font-mono mb-2">Wax: {MATERIALS[key].waxLayer}</div>
                          <p className="text-xs text-slate-400">{MATERIALS[key].desc}</p>
                      </button>
                  ))}
              </div>
              {selectedMat && (
                  <div className="text-center mt-4">
                      <button onClick={() => setPhase('defense')} className="px-8 py-3 bg-gradient-to-r from-amber-700 to-red-700 text-white font-bold rounded shadow-lg animate-bounce">
                          確認建材，開始防禦
                      </button>
                  </div>
              )}
          </div>
      )}

      {/* PHASE 3: GAME */}
      {phase === 'defense' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Panel */}
              <div className="bg-black rounded-xl border-4 border-slate-700 h-[400px] relative overflow-hidden group">
                  {/* Rain Animation Layer */}
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/46/Rain_animation.gif')] opacity-40 pointer-events-none mix-blend-screen z-10"></div>
                  
                  {/* Hut Image */}
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                      <img src={ASSETS.kuba.hut} className="w-full h-full object-cover opacity-60" alt="Kuba Hut" />
                  </div>

                  {/* Effects Overlays */}
                  {humidity > 80 && <div className="absolute inset-0 bg-green-900/60 mix-blend-color-burn z-0 transition-opacity"></div>}
                  {fireLevel > 0 && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                          <div className={`w-32 h-32 bg-orange-500/20 blur-2xl rounded-full ${fireLevel===2?'scale-150':''}`}></div>
                          <span className={`material-symbols-outlined text-orange-500 ${fireLevel===2?'text-8xl animate-pulse':'text-6xl'}`}>local_fire_department</span>
                      </div>
                  )}

                  {/* HUD */}
                  <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-30 font-mono text-xs font-bold">
                      <div className="bg-black/60 px-2 py-1 text-white rounded border border-white/20">
                          TIME: {Math.ceil(timeLeft)}s
                      </div>
                      <div className={`px-2 py-1 rounded border ${integrity < 50 ? 'bg-red-900 text-red-200 border-red-500' : 'bg-black/60 text-emerald-400 border-emerald-500'}`}>
                          HP: {Math.round(integrity)}%
                      </div>
                  </div>

                  {/* Meters */}
                  <div className="absolute bottom-4 left-4 z-30 space-y-2">
                      <div className="flex items-center gap-2 bg-black/70 px-2 py-1 rounded border-l-2 border-cyan-500">
                          <span className="material-symbols-outlined text-cyan-400 text-sm">water_drop</span>
                          <span className={`text-sm font-mono ${humidity>80?'text-red-400 animate-pulse':'text-cyan-100'}`}>{Math.round(humidity)}%</span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/70 px-2 py-1 rounded border-l-2 border-orange-500">
                          <span className="material-symbols-outlined text-orange-400 text-sm">thermostat</span>
                          <span className={`text-sm font-mono ${temp>90?'text-red-400 animate-pulse':'text-orange-100'}`}>{Math.round(temp)}°C</span>
                      </div>
                  </div>
              </div>

              {/* Control Panel */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 flex flex-col justify-between">
                  <div>
                      <h4 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined">settings_remote</span>
                          火之儀式 (Smofu)
                      </h4>
                      <p className="text-xs text-slate-400 mb-4 bg-slate-900 p-2 rounded">
                          目標：維持濕度 &lt; 80% 且 溫度 &lt; 90°C。<br/>
                          開火降濕度，但會升溫；關火降溫，但濕度會升。
                      </p>
                      <div className="flex flex-col gap-2">
                          {[0, 1, 2].map(lvl => (
                              <button
                                key={lvl}
                                onClick={() => isPlaying && setFireLevel(lvl)}
                                disabled={!isPlaying}
                                className={`p-3 rounded font-bold border flex justify-between items-center
                                    ${fireLevel === lvl 
                                        ? (lvl===0?'bg-slate-600 border-slate-400 text-white':lvl===1?'bg-orange-700 border-orange-500 text-white':'bg-red-700 border-red-500 text-white')
                                        : 'bg-slate-700 border-slate-800 text-slate-500'}
                                `}
                              >
                                  <span>{lvl===0?'OFF (關)':lvl===1?'LOW (小火)':'HIGH (大火)'}</span>
                                  <span className="material-symbols-outlined">{lvl===0?'mode_off_on':'local_fire_department'}</span>
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="mt-6">
                      {!isPlaying && gameResult === 'none' && (
                          <button onClick={startGame} className="w-full py-3 bg-red-600 text-white font-bold rounded animate-pulse">開始防禦 (Start)</button>
                      )}
                      {gameResult === 'lost' && (
                          <div className="flex flex-col gap-2">
                              <button onClick={startGame} className="w-full py-3 bg-slate-600 text-white font-bold rounded hover:bg-slate-500 transition-colors">重試 (Retry)</button>
                              <button onClick={() => { setPhase('scan'); setSelectedMat(null); setGameResult('none'); }} className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors">重新選材 (Reselect)</button>
                          </div>
                      )}
                      {gameResult === 'won' && (
                          <button onClick={handleWin} className="w-full py-3 bg-emerald-600 text-white font-bold rounded animate-bounce">任務完成 (Complete)</button>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Kuba;
