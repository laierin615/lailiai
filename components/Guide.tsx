
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
      title: "第一階段：報名與構想 (報名啟程)",
      period: "即日起 至 114年12月18日(四)",
      desc: "參賽者需於截止日前完成線上報名程序，並提交初步的研究構想。這是參與原住民雲端科展的第一步。",
      icon: "fingerprint",
      color: "text-sky-400",
      borderColor: "border-sky-500",
      bg: "bg-sky-900/30",
      tasks: [
        "至官網完成「線上報名」登錄。",
        "繳交「研究構想摘要」：請清楚說明研究動機、目的與預期成果 (500字內)。",
        "下載並簽署「學生身分切結書」，掃描後上傳。"
      ],
      loot: ["團隊基本資料表", "研究構想摘要", "學生身分切結書"]
    },
    {
      id: 2,
      title: "第二階段：原民科學研習 (培力增能)",
      period: "114年12月 - 115年1月",
      desc: "通過初審的隊伍需參加分區實體研習營，學習科學研究方法、實驗設計與原住民族傳統智慧的結合。",
      icon: "school",
      color: "text-emerald-400",
      borderColor: "border-emerald-500",
      bg: "bg-emerald-900/30",
      subEvents: [
        { title: "線上課程觀看", date: "115/1/31 前", loc: "官網教學專區" },
        { title: "實體研習 (高中組)", date: "114/12/27-28", loc: "中區(臺中教大)、東區(東華)" },
        { title: "實體研習 (國中小-北中區)", date: "115/1/24-25", loc: "清華大學" },
        { title: "實體研習 (國中小-南區)", date: "115/1/24-25", loc: "屏東大學" },
        { title: "實體研習 (國中小-東區)", date: "115/1/26-27", loc: "東華大學" },
      ],
      tasks: [
        "團隊成員須全程參與研習活動。",
        "研習結束後一週內，繳交「簡要版研究計畫書」。",
        "【補助資訊】：參加實體研習之交通費與住宿費，由主辦單位提供補助。"
      ],
      loot: ["簡要版研究計畫書"]
    },
    {
      id: 3,
      title: "第三階段：研究實作與紀錄 (雲端歷程)",
      period: "截止於 115年4月23日(四)",
      desc: "團隊依據計畫書進行實驗或田野調查，並於雲端平台持續記錄研究進度與成果。",
      icon: "construction",
      color: "text-amber-400",
      borderColor: "border-amber-500",
      bg: "bg-amber-900/30",
      tasks: [
        "執行研究計畫：進行實驗數據收集或訪談。",
        "雲端紀錄：期間至少上傳 3 次研究週誌 (含實驗照片或紀錄)。",
        "成果繳交：提交完整研究成果報告書、3分鐘歷程短片及授權同意書。"
      ],
      loot: ["研究成果報告書", "研究週誌 (含照片)", "3分鐘歷程影片", "著作權授權書"]
    },
    {
      id: 4,
      title: "第四階段：決賽與頒獎 (實體科展)",
      period: "暫訂 115年7月",
      desc: "入選決賽之隊伍將受邀至現場進行成果展示與口頭發表，由評審團選出年度最佳原住民族科學研究。",
      icon: "trophy",
      color: "text-red-400",
      borderColor: "border-red-500",
      bg: "bg-red-900/30",
      tasks: [
        "成果展示：於決賽現場佈置研究海報與實體作品。",
        "口頭發表：進行 10 分鐘的研究成果簡報。",
        "評審問答：進行 12 分鐘的提問與回應。"
      ],
      loot: ["展版海報", "實體作品", "獎狀與獎金"]
    }
  ];

  const filteredStages = stages.filter(s => 
    s.title.includes(searchTerm) || 
    s.desc.includes(searchTerm) ||
    s.tasks.some(t => t.includes(searchTerm))
  );

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] min-h-[80vh] pb-12">
      {/* Header */}
      <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-sm border-b-2 border-amber-600/50 pb-4 mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-amber-500 font-serif tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined">auto_stories</span>
                參賽攻略
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
                placeholder="搜尋攻略 (如: 報名, 研習, 報告...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {filteredStages.map((stage) => (
            <div 
                key={stage.id}
                className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${activeStage === stage.id ? `${stage.borderColor} shadow-[0_0_20px_rgba(0,0,0,0.5)]` : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
            >
                {/* Header */}
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

                {/* Details */}
                {activeStage === stage.id && (
                    <div className="p-6 border-t border-slate-700 bg-slate-900/80 animate-[slideUp_0.3s_ease-out]">
                        
                        {stage.subEvents && (
                            <div className="mb-6 bg-black/30 p-4 rounded-lg border border-slate-600">
                                <h4 className="text-emerald-400 text-sm font-bold mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    研習場次資訊
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
                            <div>
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${stage.color} flex items-center gap-2`}>
                                    <span className="material-symbols-outlined text-sm">checklist</span>
                                    階段任務
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

                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-500 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">folder_open</span>
                                    應繳文件
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
      </div>
    </div>
  );
};

export default Guide;
