
import React, { useState } from 'react';

interface GuideProps {
  onBack: () => void;
}

const Guide: React.FC<GuideProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      id: 1,
      title: "主線任務 I：初始台地的呼喚 (報名啟程)",
      period: "即日起 至 114年12月18日(四)",
      desc: "勇者啊，冒險的起點就在腳下。在希卡塔關閉之前，你必須登錄你的小隊，並向海拉魯王國證明你的潛力。",
      icon: "fingerprint",
      color: "text-sky-400",
      borderColor: "border-sky-500",
      bg: "bg-sky-900/30",
      tasks: [
        "前往「線上報名神廟」完成登錄。",
        "繳交「研究構想摘要」：這是你的滑翔傘。評審要在上百份文件中看見你的光芒，請務必精煉地說明研究的獨特性 (500字內)。",
        "簽署「學生身分切結書」：確認勇者身分的契約。"
      ],
      loot: ["團隊基本資料表", "研究構想摘要", "學生身分切結書"]
    },
    {
      id: 2,
      title: "主線任務 II：英傑的高峰修煉 (研習營)",
      period: "114年12月 - 115年1月",
      desc: "為了獲得對抗災厄的力量，所有小隊成員必須前往各地的「試煉神廟」進行修行，解鎖原民科學的奧義。",
      icon: "school",
      color: "text-emerald-400",
      borderColor: "border-emerald-500",
      bg: "bg-emerald-900/30",
      subEvents: [
        { title: "希卡石板線上傳輸", date: "115/1/31 前", loc: "官網觀看影片" },
        { title: "實體試煉 (高中組)", date: "114/12/27-28", loc: "中區(臺中教大)、東區(東華)" },
        { title: "實體試煉 (國中小-北中區)", date: "115/1/24-25", loc: "清華大學" },
        { title: "實體試煉 (國中小-南區)", date: "115/1/24-25", loc: "屏東大學" },
        { title: "實體試煉 (國中小-東區)", date: "115/1/26-27", loc: "東華大學" },
      ],
      tasks: [
        "全員強制參與：這是提升心心上限的唯一途徑！",
        "繳交「簡要版研究計畫書」：研習結束後一週內，證明你已習得符文之力。",
        "【導師特典】：參加實體試煉的旅費與住宿，將由王國經費全額資助！"
      ],
      loot: ["簡要版研究計畫書"]
    },
    {
      id: 3,
      title: "主線任務 III：荒野的試煉 (研究製作)",
      period: "截止於 115年4月23日(四)",
      desc: "這是最漫長的征途。你需要穿越迷霧森林，擊敗研究路上的怪物，並將過程記錄在「勇者軌跡」模式中。",
      icon: "construction",
      color: "text-amber-400",
      borderColor: "border-amber-500",
      bg: "bg-amber-900/30",
      tasks: [
        "執行研究計畫：將構想化為現實。",
        "開啟「勇者軌跡」：期間至少上傳 3 次研究週誌，讓高塔掌握你的行蹤。",
        "煉製成果：將汗水結晶化為實體報告。"
      ],
      loot: ["研究成果報告書", "完整研究週誌 (含10張照片)", "3分鐘歷程回憶短片", "著作權授權同意書"]
    },
    {
      id: 4,
      title: "最終決戰：災厄討伐 (實體科展)",
      period: "暫訂 115年7月",
      desc: "血月升起，決戰時刻！帶著你的神獸（研究成果）前往海拉魯城堡，面對最終的守護者（評審）。",
      icon: "trophy",
      color: "text-red-400",
      borderColor: "border-red-500",
      bg: "bg-red-900/30",
      tasks: [
        "佈置展版：建立你的戰鬥據點。",
        "10分鐘簡報：發動「英傑之詩」，講述你的傳奇。",
        "12分鐘問答：防禦守護者的雷射鎖定，展現團隊默契。"
      ],
      loot: ["展版海報", "實體作品", "無上的榮耀"]
    }
  ];

  const filteredStages = stages.filter(s => 
    s.title.includes(searchTerm) || 
    s.desc.includes(searchTerm) ||
    s.tasks.some(t => t.includes(searchTerm))
  );

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] min-h-[80vh] pb-12">
      {/* Header with Search (Sheikah Slate Style) */}
      <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-sm border-b-2 border-amber-600/50 pb-4 mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-amber-500 font-serif tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined">auto_stories</span>
                冒險筆記
            </h2>
            <button 
                onClick={onBack}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-600 hover:border-amber-500 transition-all"
            >
                <span className="material-symbols-outlined text-sm">reply</span> 返回地圖
            </button>
        </div>

        <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-amber-500/50 group-focus-within:text-amber-400 transition-colors">search</span>
            </div>
            <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-3 border-2 border-slate-700 rounded-lg leading-5 bg-slate-800 text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm font-mono transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                placeholder="檢索攻略關鍵字 (如: 報名, 研習, 報告...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-[10px] text-amber-500/30 uppercase tracking-widest font-bold">Sheikah Search</span>
            </div>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {filteredStages.map((stage) => (
            <div 
                key={stage.id}
                className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${activeStage === stage.id ? `${stage.borderColor} shadow-[0_0_20px_rgba(0,0,0,0.5)]` : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
            >
                {/* Quest Header */}
                <div 
                    className={`p-6 cursor-pointer flex items-start gap-4 ${activeStage === stage.id ? stage.bg : ''}`}
                    onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                >
                    <div className={`p-3 rounded-full bg-slate-900 border ${stage.borderColor} ${stage.color} shrink-0`}>
                        <span className="material-symbols-outlined text-2xl">{stage.icon}</span>
                    </div>
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                            <h3 className={`text-xl font-bold ${stage.color} font-serif`}>{stage.title}</h3>
                            <span className="text-xs font-mono text-slate-400 bg-black/40 px-2 py-1 rounded border border-slate-700 mt-1 md:mt-0">
                                <span className="material-symbols-outlined text-[10px] align-middle mr-1">schedule</span>
                                {stage.period}
                            </span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{stage.desc}</p>
                    </div>
                    <span className={`material-symbols-outlined text-slate-500 transition-transform duration-300 ${activeStage === stage.id ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>

                {/* Quest Details (Expanded) */}
                {activeStage === stage.id && (
                    <div className="p-6 border-t border-slate-700 bg-slate-900/80 animate-[slideUp_0.3s_ease-out]">
                        
                        {/* Sub Events (Specific for Stage 2) */}
                        {stage.subEvents && (
                            <div className="mb-6 bg-black/30 p-4 rounded-lg border border-slate-600">
                                <h4 className="text-emerald-400 text-sm font-bold mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    試煉神廟座標
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    {stage.subEvents.map((ev, idx) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-slate-700/50 pb-1">
                                            <span className="text-slate-300">{ev.title}</span>
                                            <div className="text-right">
                                                <span className="text-emerald-500 block">{ev.date}</span>
                                                <span className="text-slate-500 block scale-90 origin-right">{ev.loc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Tasks */}
                            <div>
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${stage.color} flex items-center gap-2`}>
                                    <span className="material-symbols-outlined text-sm">checklist</span>
                                    核心任務
                                </h4>
                                <ul className="space-y-3">
                                    {stage.tasks.map((task, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                            <span className={`${stage.color} font-bold`}>▶</span>
                                            <span dangerouslySetInnerHTML={{__html: task}}></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Loot/Docs */}
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-500 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">folder_open</span>
                                    關鍵道具 (需繳交)
                                </h4>
                                <div className="space-y-2">
                                    {stage.loot.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 bg-slate-800 rounded border border-slate-600">
                                            <span className="material-symbols-outlined text-amber-500 text-sm">description</span>
                                            <span className="text-xs text-amber-100">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ))}

        {filteredStages.length === 0 && (
            <div className="text-center py-10 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">sentiment_dissatisfied</span>
                <p>希卡感應器未偵測到相關任務...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Guide;
