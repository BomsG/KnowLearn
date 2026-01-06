export type QuestionType = "mcq" | "short_answer";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  explanation?: string;
  timer?: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  bannerUrl?: string;
  themeColor?: string;
  coverImage?: string;
  settings: {
    overallTimer?: number;
    isReleased: boolean;
    requireConfidence: boolean;
    shuffleQuestions: boolean;
  };
}

export interface ResponseEntry {
  questionId: string;
  answer: string;
  confidence: number;
  timeSpent: number;
  isCorrect?: boolean;
}

export interface QuizResponse {
  id: string;
  quizId: string;
  respondentName: string;
  startTime: string;
  endTime: string;
  entries: ResponseEntry[];
  totalScore: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}
