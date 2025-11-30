import React from 'react';

interface ModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, isSuccess, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full shadow-2xl relative animate-[fadeIn_0.3s_ease-out]">
        <button 
          className="absolute top-4 right-4 text-slate-500 hover:text-white" 
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="mb-4 text-center">
          {isSuccess ? (
            <span className="material-symbols-outlined text-5xl text-emerald-500">verified</span>
          ) : (
            <span className="material-symbols-outlined text-5xl text-red-500">error</span>
          )}
        </div>
        <h3 className={`text-2xl font-bold text-center mb-2 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
          {title}
        </h3>
        <div 
          className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <button 
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded transition-colors border border-slate-600" 
          onClick={onClose}
        >
          確認
        </button>
      </div>
    </div>
  );
};

export default Modal;