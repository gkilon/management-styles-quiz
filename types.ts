export type Column = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  text: string;
  column: Column;
}

export interface Question {
  id: number;
  options: [QuestionOption, QuestionOption];
}

export interface Answers {
  [key: number]: number;
}

export interface Scores {
  A: number;
  B: number;
  C: number;
  D: number;
}
