
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import MapHub from './components/MapHub';
import Guide from './components/Guide';
import Prologue from './components/levels/Prologue';
import Taxonomy from './components/levels/Taxonomy';
import Trap from './components/levels/Trap';
import Pharmacy from './components/levels/Pharmacy';
import Granary from './components/levels/Granary';
import Dye from './components/levels/Dye';
import River from './components/levels/River';
import Final from './components/levels/Final';
import Modal from './components/ui/Modal';
import EduModal from './components/ui/EduModal';
import { EDU_DATA, INITIAL_GAME_STATE, ASSETS } from './constants';
import { GameState, LevelId, ModalState, EduModalState, ScoreState, LevelAnswers } from './types';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<'login' | 'map' | 'guide' | 'level'>('login');
  const [currentLevelId, setCurrentLevelId] = useState<LevelId | null>(null);
  const [teamName, setTeamName] = useState('');
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [scores, setScores] = useState<ScoreState>({});
  const [levelAnswers, setLevelAnswers] = useState<LevelAnswers>({});
  
  // Timer State
  const levelStartTimeRef = useRef<number>(0);

  // Feedback Modal State
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isSuccess: false,
    title: '',
    message: ''
  });

  // Education Modal State
  const [eduModalState, setEduModalState] = useState<EduModalState>({
    isOpen: false,
    levelId: null
  });

  // Optimized Image Loading
  useEffect(() => {
    const img = new Image();
    img.src = ASSETS.login_bg;
  }, []);

  const preloadLevelAssets = (levelId: LevelId) => {
    // @ts-ignore
    const levelAssets = ASSETS[levelId];
    if (levelAssets && typeof levelAssets === 'object') {
      Object.values(levelAssets).forEach((url: string) => {
        const img = new Image();
        img.src = url;
      });
    }
  };

  const handleStartGame = (name: string) => {
    setTeamName(name);
    setCurrentStage('map');
    const img = new Image();
    img.src = ASSETS.final.torch;
  };

  const handleSaveAnswer = (levelId: LevelId, answer: string) => {
    console.log(`Saving answer for ${levelId}:`, answer);
    setLevelAnswers(prev => ({
      ...prev,
      [levelId]: answer
    }));
  };

  const submitGameData = (finalGameState: GameState, finalScores: ScoreState, finalAnswers: LevelAnswers) => {
    const url = "https://script.google.com/macros/s/AKfycbzRnc2oA36mAyOu1dJsQ8qAH6lWDh0OX6RjftugEOwkD6zPCGkoCMZHn2LYv9bftCyb5w/exec";
    
    // Calculate total score
    const totalScore = (Object.values(finalScores) as number[]).reduce((a, b) => a + b, 0);

    const formData = new URLSearchParams();
    formData.append('teamName', teamName);
    formData.append('timestamp', new Date().toISOString());
    formData.append('scores', JSON.stringify(finalScores));
    formData.append('progress', JSON.stringify(finalGameState));
    formData.append('answers', JSON.stringify(finalAnswers)); // Include text answers
    formData.append('totalScore', String(totalScore));

    console.log("Submitting Data:", {
        teamName,
        totalScore,
        answers: finalAnswers
    });

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    }).then(() => {
      console.log('Game data successfully transmitted to Sheikah Tower.');
    }).catch(err => {
      console.error('Transmission failed:', err);
    });
  };

  const handleEnterLevel = (id: LevelId) => {
    preloadLevelAssets(id);
    setCurrentLevelId(id);
    setCurrentStage('level');
    levelStartTimeRef.current = Date.now();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterGuide = () => {
    setCurrentStage('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToMap = () => {
    setCurrentLevelId(null);
    setCurrentStage('map');
  };

  const handleLevelFail = (msg: string) => {
    setModalState({
      isOpen: true,
      isSuccess: false,
      title: '試煉失敗',
      message: msg,
    });
  };

  const handleLevelSuccessMsg = (msg: string) => {
    setModalState({
      isOpen: true,
      isSuccess: true,
      title: '試煉通過',
      message: msg
    });
  };

  const calculateScore = () => {
    const timeTaken = (Date.now() - levelStartTimeRef.current) / 1000;
    const score = Math.max(100, Math.round(1000 - timeTaken));
    return score;
  };

  const handleLevelComplete = (id: LevelId) => {
    let newScores = { ...scores };
    
    if (id !== 'prologue') {
      if (!scores[id]) {
        newScores = { ...scores, [id]: calculateScore() };
        setScores(newScores);
      }
    }

    const newGameState = { ...gameState, [id]: true };
    setGameState(newGameState);

    if (id === 'final') {
        setTimeout(() => submitGameData(newGameState, newScores, levelAnswers), 100); 
    }
  };

  const closeGenericModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (!modalState.isOpen && modalState.isSuccess && currentLevelId && !eduModalState.isOpen) {
      if (gameState[currentLevelId]) {
        if (currentLevelId !== 'trap') {
            setTimeout(() => {
            setEduModalState({
                isOpen: true,
                levelId: currentLevelId
            });
            }, 300);
        } else {
            handleReturnToMap();
        }
      }
    }
  }, [modalState.isOpen, modalState.isSuccess, currentLevelId, gameState, eduModalState.isOpen]);

  const getProgress = () => {
    const levels = Object.keys(INITIAL_GAME_STATE) as LevelId[];
    const completed = levels.filter(k => gameState[k]).length;
    return (completed / levels.length) * 100;
  };

  const getTotalScore = () => (Object.values(scores) as number[]).reduce((a, b) => a + b, 0);

  const renderLevel = () => {
    const commonProps = {
      onFail: handleLevelFail,
      onSuccessMsg: handleLevelSuccessMsg,
      onComplete: () => handleLevelComplete(currentLevelId as LevelId),
      onSaveAnswer: (ans: string) => handleSaveAnswer(currentLevelId as LevelId, ans),
    };

    switch (currentLevelId) {
      case 'prologue': return <Prologue {...commonProps} />;
      case 'taxonomy': return <Taxonomy {...commonProps} />;
      case 'trap': return <Trap {...commonProps} />;
      case 'pharmacy': return <Pharmacy {...commonProps} />;
      case 'granary': return <Granary {...commonProps} />;
      case 'dye': return <Dye {...commonProps} />;
      case 'river': return <River {...commonProps} />;
      case 'final': return <Final {...commonProps} onComplete={() => {
          handleLevelComplete('final');
          handleLevelSuccessMsg("傳承解鎖！<br>科學是傳統的翻譯。恭喜你完成原科解密任務。");
      }} />;
      default: return null;
    }
  };

  const handleEduClose = () => {
      setEduModalState({ isOpen: false, levelId: null });
      handleReturnToMap();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header teamName={teamName} progress={getProgress()} />
      <div className="fixed top-16 right-4 z-40 bg-slate-900/80 backdrop-blur border border-amber-500/50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-500 text-sm">trophy</span>
        <span className="font-mono text-amber-400 font-bold">{getTotalScore()}</span>
      </div>

      <main className="flex-grow pt-24 pb-12 px-4 max-w-5xl mx-auto w-full relative">
        {currentStage === 'login' && <Login onStart={handleStartGame} />}
        
        {currentStage === 'map' && (
          <MapHub gameState={gameState} onEnterLevel={handleEnterLevel} onOpenGuide={handleEnterGuide} />
        )}

        {currentStage === 'guide' && (
          <Guide onBack={handleReturnToMap} />
        )}

        {currentStage === 'level' && (
          <div className="relative min-h-[60vh] animate-[fadeIn_0.5s_ease-out]">
            <button 
              onClick={handleReturnToMap}
              className="absolute top-0 right-0 z-40 text-slate-400 hover:text-white flex items-center gap-1 text-sm bg-slate-800/80 px-3 py-1 rounded-full border border-slate-600 hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">map</span> 地圖
            </button>
            <div className="pt-8">
              {renderLevel()}
            </div>
          </div>
        )}
      </main>

      <Modal 
        isOpen={modalState.isOpen}
        isSuccess={modalState.isSuccess}
        title={modalState.title}
        message={modalState.message}
        onClose={closeGenericModal}
      />

      <EduModal 
        isOpen={eduModalState.isOpen}
        data={eduModalState.levelId ? EDU_DATA[eduModalState.levelId] : null}
        onClose={handleEduClose}
      />
    </div>
  );
};

export default App;
