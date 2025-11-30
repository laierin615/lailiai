import React from 'react';
import { EduData } from '../../types';

interface EduModalProps {
  isOpen: boolean;
  data: EduData | null;
  onClose: () => void;
}

const EduModal: React.FC<EduModalProps> = ({ isOpen, data, onClose }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-600 rounded-xl max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-[slideUp_0.5s_ease-out]">
        {/* Header */}
        <div className="bg-amber-900/30 p-6 border-b border-amber-800 flex items-center gap-4">
          <div className="p-3 bg-amber-800 rounded-full text-amber-200">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-amber-500">原科解密報告</h2>
            <p className="text-amber-200/60 text-sm uppercase tracking-widest">原住民科學展覽連結</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 border-l-4 border-amber-500 pl-3">
                {data.title}
              </h3>
              <div 
                className="text-slate-300 leading-loose text-sm text-justify"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 text-center">
          <button 
            className="px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105" 
            onClick={onClose}
          >
            收錄變因
          </button>
        </div>
      </div>
    </div>
  );
};

export default EduModal;