export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'NORMAL' | 'VIP' | 'SVIP';
}

export interface Question {
  id: number;
  title: string;
  content: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'ESSAY';
  options?: string;
  answer: string;
  explanation?: string;
  aiExplanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string;
  creator?: User;
  knowledgePoints?: KnowledgePoint[];
}

export interface KnowledgePoint {
  id: number;
  title: string;
  content: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category?: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionSet {
  id: number;
  title: string;
  description?: string;
  creator: User;
  questions: Question[];
  timeLimit?: number;
  totalScore?: number;
  isPublic: boolean;
}

export interface UserAnswer {
  id: number;
  user: User;
  question: Question;
  questionSet?: QuestionSet;
  answer: string;
  isCorrect: boolean;
  score: number;
  timeSpent?: number;
  aiFeedback?: string;
  submittedAt: string;
}

export interface Collection {
  id: number;
  user: User;
  question: Question;
  notes?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserStatistics {
  userId: number;
  username: string;
  fullName: string;
  role: string;
  completedQuestionsCount: number;
  correctAnswersCount: number;
  addedQuestionsCount: number;
  createdQuestionSetsCount: number;
  totalScore: number;
}
