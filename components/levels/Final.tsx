
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

const Final: React.FC<FinalProps> = ({ onComplete, onSaveAnswer, levelAnswers, initialAnswer }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState("");
  
  // Extract specific data from previous levels
  const taxonomyTopic = levelAnswers.taxonomy || "未偵測到主題";
  const trapData = levelAnswers.trap || "未偵測到實驗設計";
  
  // Load previous answer if available
  useEffect(() => {
    if (initialAnswer) {
      setProposal(initialAnswer);
    }
  }, [initialAnswer]);

  const generateProposal = async () => {
    if (!process.env.API_KEY) {
        console.error("API Key not found");
        return;
    }

    setIsGenerating(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Construct a highly specific prompt using the gathered data
        const context = `
            The student has completed a gamified learning journey about Indigenous Science.
            
            1. **Detected Research Topic (from Initial Plateau)**: 
               "${taxonomyTopic}"
            
            2. **Detected Experimental Design (from Trial of Power)**: 
               "${trapData}"
               (Note: IV=Independent Variable, DV=Dependent Variable, CV=Control Variable)
            
            3. **Other Concepts Learned**:
               - Friction & Physics (Granary Level)
               - Chemical Extraction (Dye Level)
               - Quantitative Analysis (River Level)
        `;

        const prompt = `
            You are a mentor for the "Indigenous Science Fair (原住民雲端科展)". 
            Your goal is to help the student synthesize their game progress into a coherent **Research Proposal Summary (研究構想摘要)**.

            Please write a ~500 words proposal in **Traditional Chinese (Taiwan)** based strictly on the context above.

            **Structure:**
            1. **研究動機 (Motivation)**: 
               - Start by referencing their specific topic: "${taxonomyTopic}".
               - Connect it to why preserving this indigenous wisdom is important.
            
            2. **研究目的 (Objectives)**: 
               - Clearly state what they intend to find out based on their topic.

            3. **研究方法與變因 (Methodology & Variables)**: 
               - **CRITICAL**: You MUST use the exact variables they defined in the "Trial of Power" data: ${trapData}.
               - Explain how they will manipulate the Independent Variable to measure the Dependent Variable, while keeping Control Variables constant.
               - Mention using quantitative methods (inspired by the River level) to measure results.

            4. **預期成果 (Expected Outcome)**: 
               - What scientific value will this bring? How does it validate the traditional wisdom?

            **Tone:** Encouraging, academic, structured.
            **Context:** ${context}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text || "生成失敗，請稍後再試。";
        setProposal(text);
        onSaveAnswer(text); // Save the generated proposal as the final answer

    } catch (error) {
        console.error("AI Generation Error", error);
        setProposal("希卡石板連線中斷... 無法生成報告。請檢查網路或 API Key。");
    } finally {
        setIsGenerating(false);
    }
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
                          {levelAnswers.taxonomy ? (
                              <span className="text-emerald-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> 已登錄</span>
                          ) : (
                              <span className="text-red-400">未檢測</span>
                          )}
                      </div>
                      <div className="text-slate-300 pl-2 border-l-2 border-emerald-500/30 truncate">
                          {taxonomyTopic}
                      </div>

                      <div className="flex justify-between items-center border-b border-slate-700 pb-2 pt-2">
                          <span className="text-slate-400">實驗變因 (Trial of Power)</span>
                          {levelAnswers.trap ? (
                              <span className="text-emerald-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> 已登錄</span>
                          ) : (
                              <span className="text-red-400">未檢測</span>
                          )}
                      </div>
                      <div className="text-slate-300 pl-2 border-l-2 border-emerald-500/30 text-xs break-all">
                          {trapData}
                      </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mt-4">
                      古代核心 (AI) 將讀取上述數據，協助你撰寫完整的「研究構想摘要」。
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
                        生成研究構想摘要
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
