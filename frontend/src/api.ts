import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
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

// Auth API
export const authAPI = {
  register: (data: { username: string; password: string; email: string; fullName?: string }) =>
    api.post<ApiResponse<User>>('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<User>>('/auth/login', data),
  
  getUserById: (id: number) =>
    api.get<ApiResponse<User>>(`/auth/user/${id}`),
};

// Question API
export const questionAPI = {
  create: (data: any, userId: number) =>
    api.post<ApiResponse<Question>>(`/questions?userId=${userId}`, data),
  
  update: (id: number, data: any, userId: number) =>
    api.put<ApiResponse<Question>>(`/questions/${id}?userId=${userId}`, data),
  
  getById: (id: number) =>
    api.get<ApiResponse<Question>>(`/questions/${id}`),
  
  getAll: () =>
    api.get<ApiResponse<Question[]>>('/questions'),
  
  search: (params: { keyword?: string; type?: string; difficulty?: string; page?: number; size?: number }) =>
    api.get<ApiResponse<any>>('/questions/search', { params }),
  
  getByCreator: (creatorId: number) =>
    api.get<ApiResponse<Question[]>>(`/questions/creator/${creatorId}`),
  
  getByTag: (tag: string, page?: number, size?: number) =>
    api.get<ApiResponse<any>>(`/questions/tag/${tag}`, { params: { page, size } }),
  
  delete: (id: number, userId: number) =>
    api.delete<ApiResponse<void>>(`/questions/${id}?userId=${userId}`),
};

// Question Set API
export const questionSetAPI = {
  create: (data: any, userId: number) =>
    api.post<ApiResponse<QuestionSet>>(`/question-sets?userId=${userId}`, data),
  
  update: (id: number, data: any, userId: number) =>
    api.put<ApiResponse<QuestionSet>>(`/question-sets/${id}?userId=${userId}`, data),
  
  getById: (id: number) =>
    api.get<ApiResponse<QuestionSet>>(`/question-sets/${id}`),
  
  getAll: () =>
    api.get<ApiResponse<QuestionSet[]>>('/question-sets'),
  
  getByCreator: (creatorId: number) =>
    api.get<ApiResponse<QuestionSet[]>>(`/question-sets/creator/${creatorId}`),
  
  getPublic: () =>
    api.get<ApiResponse<QuestionSet[]>>('/question-sets/public'),
  
  delete: (id: number, userId: number) =>
    api.delete<ApiResponse<void>>(`/question-sets/${id}?userId=${userId}`),
};

// Answer API
export const answerAPI = {
  submit: (data: { questionId: number; questionSetId?: number; answer: string; timeSpent?: number }, userId: number) =>
    api.post<ApiResponse<UserAnswer>>(`/answers/submit?userId=${userId}`, data),
  
  getUserAnswers: (userId: number) =>
    api.get<ApiResponse<UserAnswer[]>>(`/answers/user/${userId}`),
  
  getUserAnswersByQuestionSet: (userId: number, questionSetId: number) =>
    api.get<ApiResponse<UserAnswer[]>>(`/answers/user/${userId}/question-set/${questionSetId}`),
};

// Collection API
export const collectionAPI = {
  add: (questionId: number, notes: string | undefined, userId: number) =>
    api.post<ApiResponse<Collection>>(`/collections?questionId=${questionId}&userId=${userId}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`),
  
  remove: (id: number, userId: number) =>
    api.delete<ApiResponse<void>>(`/collections/${id}?userId=${userId}`),
  
  updateNotes: (id: number, notes: string, userId: number) =>
    api.put<ApiResponse<Collection>>(`/collections/${id}/notes?notes=${encodeURIComponent(notes)}&userId=${userId}`),
  
  getUserCollections: (userId: number) =>
    api.get<ApiResponse<Collection[]>>(`/collections/user/${userId}`),
  
  isCollected: (userId: number, questionId: number) =>
    api.get<ApiResponse<boolean>>(`/collections/check?userId=${userId}&questionId=${questionId}`),
};

// Knowledge Point API
export const knowledgePointAPI = {
  create: (data: any, userId: number) =>
    api.post<ApiResponse<KnowledgePoint>>(`/knowledge-points?userId=${userId}`, data),
  
  update: (id: number, data: any, userId: number) =>
    api.put<ApiResponse<KnowledgePoint>>(`/knowledge-points/${id}?userId=${userId}`, data),
  
  getById: (id: number) =>
    api.get<ApiResponse<KnowledgePoint>>(`/knowledge-points/${id}`),
  
  getAll: () =>
    api.get<ApiResponse<KnowledgePoint[]>>('/knowledge-points'),
  
  search: (params: { keyword?: string; difficulty?: string; category?: string; page?: number; size?: number }) =>
    api.get<ApiResponse<any>>('/knowledge-points/search', { params }),
  
  getByCreator: (creatorId: number) =>
    api.get<ApiResponse<KnowledgePoint[]>>(`/knowledge-points/creator/${creatorId}`),
  
  getByCategory: (category: string, page?: number, size?: number) =>
    api.get<ApiResponse<any>>(`/knowledge-points/category/${category}`, { params: { page, size } }),
  
  delete: (id: number, userId: number) =>
    api.delete<ApiResponse<void>>(`/knowledge-points/${id}?userId=${userId}`),
};

// AI Service API
export const aiAPI = {
  generateExplanation: (data: { questionTitle: string; questionContent: string; answer: string }) =>
    api.post<ApiResponse<string>>('/ai/explain', data),
  
  gradeEssay: (data: { questionContent: string; expectedAnswer: string; studentAnswer: string }) =>
    api.post<ApiResponse<any>>('/ai/grade-essay', data),
};

export default api;
