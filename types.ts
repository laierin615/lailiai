
export interface GameState {
  prologue: boolean;
  taxonomy: boolean;
  trap: boolean;
  granary: boolean;
  dye: boolean;
  river: boolean;
  kuba: boolean; // Side Level 1
  rattan: boolean; // Side Level 2 (New)
  final: boolean;
}

export type LevelId = keyof GameState;

export interface EduData {
  title: string;
  text: string;
}

export interface ModalState {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  onClose?: () => void;
}

export interface EduModalState {
  isOpen: boolean;
  levelId: LevelId | null;
}

export interface ScoreState {
  [key: string]: number; // LevelId -> Score
}

export interface LevelAnswers {
  [key: string]: string; // LevelId -> User Input Text
}
