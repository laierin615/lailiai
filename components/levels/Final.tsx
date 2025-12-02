
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LevelAnswers } from '../../types';

interface FinalProps {
  onComplete: () => void;
  onFail: (msg: string) => void;
  onSuccessMsg: (msg: string) => void;
  onSaveAnswer: (ans: string) => void;
  levelAnswers: LevelAnswers;
  initialAnswer?: string;
}

// --- 離線備援生成器 (Offline Generator) ---
// 當 API 失敗時，使用此函數根據變因組裝一份像樣的報告
const generateOfflineProposal = (topic: string, trapData: string): string => {
    // 嘗試解析 Trap 的變因 (格式通常為 Topic: ... | IV: ... | DV: ... | CV: ...)
    let iv = "陷阱材質 (Material)";
    let dv = "觸發成功率 (Success Rate)";
    let cv = "擺放高度 (Height)";
    
    if (trapData && trapData.includes('|')) {
        const parts = trapData.split('|');
        parts.forEach(p => {
            if (p.includes('IV:')) iv = p.replace('IV:', '').trim();
            if (p.includes('DV:')) dv = p.replace('DV:', '').trim();
            if (p.includes('CV:')) cv = p.replace('CV:', '').trim();
        });
    }

    const cleanTopic = topic.replace("Topic:", "").trim() || "原住民傳統陷阱的力學分析";

    return `【系統自動生成 (離線模式)】

一、研究動機 (Motivation)
本次研究主題為「${cleanTopic}」。原住民族的傳統智慧中蘊含著豐富的科學原理，例如在狩獵陷阱中對力學與材料特性的精準掌握。為了保存並驗證這些瀕臨失傳的技藝，本研究希望能以現代科學方法進行解構與分析。

二、研究目的 (Objectives)
1. 探討不同環境變因對裝置運作效率的影響。
2. 建立量化數據模型，驗證傳統經驗法則（如：「太高打不到，太低打不暈」）的科學依據。
3. 將研究成果應用於防災或結構力學教學。

三、研究方法與變因 (Methodology)
本實驗設計採用控制變因法進行模擬測試：
1. 操縱變因 (Independent Variable)：${iv}。我們將改變此條件以觀察變化。
2. 應變變因 (Dependent Variable)：${dv}。透過測量此數據來判斷實驗結果。
3. 控制變因 (Control Variables)：${cv}。實驗過程中保持固定，以確保數據準確性。

四、預期成果 (Expected Outcome)
預期能找出${iv}與${dv}之間的最佳化關係曲線。這不僅證明了祖先的智慧符合物理學中的能量守恆與摩擦力原理，更能為現代仿生結構設計提供新的靈感。`;
};

const Final: React.FC<FinalProps> = ({ onComplete, onSaveAnswer, levelAnswers, initialAnswer }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState("");
  
  // Extract specific data from previous levels safely
  const taxonomyTopic = levelAnswers?.taxonomy || "未偵測到主題";
  const trapData = levelAnswers?.trap || "未偵測到實驗設計";
  
  // Check if data is missing (for fallback generation)
  const isMissingData = taxonomyTopic.includes("未偵測") || trapData.includes("未偵測");

  // Load previous answer if available
  useEffect(() => {
    if (initialAnswer) {
      setProposal(initialAnswer);
    }
  }, [initialAnswer]);

  const generateProposal = async () => {
    setIsGenerating(true);
    let resultText = "";

    // 1. 嘗試 API 呼叫
    if (process.env.API_KEY) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let context = "";
            if (isMissingData) {
                context = `Data Missing. User skipped levels. Topic: Granary Mechanics. IV: Surface Friction. DV: Drop Rate.`;
            } else {
                context = `Topic: ${taxonomyTopic}. Trap Data: ${trapData}. Concepts: Physics, Chemistry, Quantitative Analysis.`;
            }

            const prompt = `
                Role: Science Fair Mentor.
                Task: Write a research proposal summary in Traditional Chinese (~400 words).
                Topic Context: ${context}
                
                Structure:
                1. Motivation: Link indigenous wisdom to science.
                2. Objectives.
                3. Methodology: Explain the IV, DV, CV provided in context.
                4. Outcome.
                
                Constraint: Do not mention "safety violation". Treat "traps" as "mechanical structures" for physics study.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    maxOutputTokens: 2000,
                    // 強制放寬安全設定，避免因 "Trap" 被誤殺
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                    ]
                }
            });

            if (response.text) {
                resultText = response.text;
            } else {
                throw new Error("Empty response");
            }

        } catch (error) {
            console.warn("AI Generation Failed (Safety or Network), switching to Offline Mode.", error);
            // API 失敗時，不顯示錯誤，直接使用離線備援
            resultText = generateOfflineProposal(taxonomyTopic, trapData);
        }
    } else {
        // 無 API Key，直接使用離線備援
        console.warn("No API Key, using Offline Mode.");
        resultText = generateOfflineProposal(taxonomyTopic, trapData);
    }

    setProposal(resultText);
    onSaveAnswer(resultText); 
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(proposal);
      alert("已複製到剪貼簿！");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-center animate-[fadeIn_1s_ease-out] pb-12">
      <div>
        <span className="text-amber-500 text-xs tracking-[0.3em] uppercase border border-amber-500 px-3 py-1 rounded-full">Final Trial</span>
        <h2 className="text-4xl font-bold text-white mt-4 mb-2 font-serif">終焉之谷：傳承之火</h2>
        <p className="text-slate-400 text-sm">將旅途中的碎片，煉成照亮未來的火炬</p>
      </div>
      
      {!proposal ? (
          <div className="bg-slate-900 p-8 rounded-xl border-2 border-amber-900/50 shadow-2xl relative overflow-hidden group max-w-2xl mx-auto">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900 via-slate-900 to-black"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-amber-900/20 rounded-full flex items-center justify-center border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <span className="material-symbols-outlined text-5xl text-amber-500 animate-pulse">auto_awesome</span>
              </div>
              
              <div className="space-y-4 w-full">
                  <h3 className="text-2xl font-bold text-white">希卡石板資料同步中...</h3>
                  
                  {/* Data Synchronization UI */}
                  <div className="text-left bg-black/60 p-5 rounded border border-slate-700 text-sm font-mono space-y-3 shadow-inner">
                      <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                          <span className="text-slate-400">研究主題 (Initial Plateau)</span>
                          {levelAnswers?.taxonomy ? (
                              <span className="text-emerald-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> 已登錄</span>
                          ) : (
                              <span className="text-red-400">未檢測 (啟用預設)</span>
                          )}
                      </div>
                      <div className="text-slate-300 pl-2 border-l-2 border-emerald-500/30 truncate">
                          {taxonomyTopic}
                      </div>

                      <div className="flex justify-between items-center border-b border-slate-700 pb-2 pt-2">
                          <span className="text-slate-400">實驗變因 (Trial of Power)</span>
                          {levelAnswers?.trap ? (
                              <span className="text-emerald-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> 已登錄</span>
                          ) : (
                              <span className="text-red-400">未檢測 (啟用預設)</span>
                          )}
                      </div>
                      <div className="text-slate-300 pl-2 border-l-2 border-emerald-500/30 text-xs break-all">
                          {trapData}
                      </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mt-4">
                      古代核心 (AI) 將讀取上述數據，協助你撰寫完整的「研究構想摘要」。
                      <br/>
                      <span className="text-xs text-slate-500">(若連線不穩定，系統將啟動備援協議自動生成)</span>
                  </p>
              </div>

              <button 
                onClick={generateProposal}
                disabled={isGenerating}
                className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all
                    ${isGenerating 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                        : 'bg-gradient-to-r from-amber-700 to-red-700 text-white hover:from-amber-600 hover:to-red-600 border border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'}
                `}
              >
                {isGenerating ? (
                    <>
                        <span className="material-symbols-outlined animate-spin">cyclone</span>
                        正在編織傳承之火 (Generating)...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined">history_edu</span>
                        {isMissingData ? '生成範例研究構想' : '生成研究構想摘要'}
                    </>
                )}
              </button>
            </div>
          </div>
      ) : (
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-xl p-8 shadow-2xl animate-[slideUp_0.5s_ease-out] relative max-w-3xl mx-auto text-left">
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-3xl">verified</span>
                      <h3 className="text-xl font-bold text-white">研究構想摘要 (草案)</h3>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded border border-slate-600 transition-colors text-slate-300"
                  >
                      <span className="material-symbols-outlined text-sm">content_copy</span> 複製
                  </button>
              </div>

              <div className="bg-black/30 p-6 rounded-lg border border-slate-700/50 h-[400px] overflow-y-auto custom-scrollbar">
                  <textarea 
                    readOnly={false}
                    className="w-full h-full bg-transparent text-slate-300 text-sm leading-loose resize-none focus:outline-none font-serif whitespace-pre-wrap"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                  />
              </div>

              <div className="mt-6 flex justify-center">
                  <button 
                    onClick={onComplete}
                    className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                  >
                      <span className="material-symbols-outlined">send</span>
                      確認並完成試煉 (資料將上傳)
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default Final;
