export type ChapterId =
  | 'all'
  | 'line-constants'
  | 'transmission'
  | 'fault-surge'
  | 'distribution';

export type ExamYear = 'all' | '2021' | '2022' | '2023' | '2024';

export type ExamSessionId =
  | 'all'
  | '2021-2'
  | '2021-1'
  | '2022-2'
  | '2022-1'
  | '2023-2'
  | '2024-1';

export interface ExamSessionInfo {
  id: Exclude<ExamSessionId, 'all'>;
  year: Exclude<ExamYear, 'all'>;
  round: string;
  label: string;
  subtitle: string;
}

export type SchematicType =
  | 'gmr-triangle'
  | 'corona-field'
  | 'ferranti-vector'
  | 'pi-abcd'
  | 'sag-span'
  | 'percent-z'
  | 'fault-1lg'
  | 'petersen-coil'
  | 'surge-junction'
  | 'feeder-loss'
  | 'voltage-drop'
  | 'ratio-diff';

export interface Question {
  id: string;
  numberLabel: string;
  sessionId: Exclude<ExamSessionId, 'all'>;
  examYear: Exclude<ExamYear, 'all'>;
  examSession: string;
  chapter: Exclude<ChapterId, 'all'>;
  chapterLabel: string;
  prompt: string;
  formulaBox?: string;
  schematic?: SchematicType;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  formulaSteps: string[];
  keyTakeaway: string;
}

export type ReviewStatus = 'incorrect' | 'hold' | 'mastered';

export interface AttemptRecord {
  questionId: string;
  selectedIndex: number | null; // null indicates "모르겠어요 (Skip/Unknown)"
  isCorrect: boolean;
  status: ReviewStatus | 'correct';
  bookmarked: boolean;
  attemptsCount: number;
  updatedAt: number;
}

export type TabId = 'quiz' | 'notes';
export type QuizStage = 'cover' | 'solving';

export type NotesFilter = 'all' | 'unresolved' | 'hold' | 'mastered' | 'bookmarked';

export interface CoreFormula {
  id: string;
  chapter: Exclude<ChapterId, 'all'>;
  chapterLabel: string;
  title: string;
  equation: string;
  variables: string;
}
