import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  User,
  Question,
  QuestionSet,
  UserAnswer,
  Collection,
  KnowledgePoint,
  ApiResponse
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Auth API
  register(data: { username: string; password: string; email: string; fullName?: string }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/auth/register`, data);
  }

  login(data: { username: string; password: string }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/auth/login`, data);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/auth/user/${id}`);
  }

  // Question API
  createQuestion(data: any, userId: number): Observable<ApiResponse<Question>> {
    return this.http.post<ApiResponse<Question>>(`${this.baseUrl}/questions?userId=${userId}`, data);
  }

  updateQuestion(id: number, data: any, userId: number): Observable<ApiResponse<Question>> {
    return this.http.put<ApiResponse<Question>>(`${this.baseUrl}/questions/${id}?userId=${userId}`, data);
  }

  getQuestionById(id: number): Observable<ApiResponse<Question>> {
    return this.http.get<ApiResponse<Question>>(`${this.baseUrl}/questions/${id}`);
  }

  getAllQuestions(): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.baseUrl}/questions`);
  }

  searchQuestions(params: { keyword?: string; type?: string; difficulty?: string; page?: number; size?: number }): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/questions/search`, { params: httpParams });
  }

  getQuestionsByCreator(creatorId: number): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.baseUrl}/questions/creator/${creatorId}`);
  }

  getQuestionsByTag(tag: string, page?: number, size?: number): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    if (page !== undefined) httpParams = httpParams.set('page', page.toString());
    if (size !== undefined) httpParams = httpParams.set('size', size.toString());
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/questions/tag/${tag}`, { params: httpParams });
  }

  deleteQuestion(id: number, userId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/questions/${id}?userId=${userId}`);
  }

  // Question Set API
  createQuestionSet(data: any, userId: number): Observable<ApiResponse<QuestionSet>> {
    return this.http.post<ApiResponse<QuestionSet>>(`${this.baseUrl}/question-sets?userId=${userId}`, data);
  }

  updateQuestionSet(id: number, data: any, userId: number): Observable<ApiResponse<QuestionSet>> {
    return this.http.put<ApiResponse<QuestionSet>>(`${this.baseUrl}/question-sets/${id}?userId=${userId}`, data);
  }

  getQuestionSetById(id: number): Observable<ApiResponse<QuestionSet>> {
    return this.http.get<ApiResponse<QuestionSet>>(`${this.baseUrl}/question-sets/${id}`);
  }

  getAllQuestionSets(): Observable<ApiResponse<QuestionSet[]>> {
    return this.http.get<ApiResponse<QuestionSet[]>>(`${this.baseUrl}/question-sets`);
  }

  getQuestionSetsByCreator(creatorId: number): Observable<ApiResponse<QuestionSet[]>> {
    return this.http.get<ApiResponse<QuestionSet[]>>(`${this.baseUrl}/question-sets/creator/${creatorId}`);
  }

  getPublicQuestionSets(): Observable<ApiResponse<QuestionSet[]>> {
    return this.http.get<ApiResponse<QuestionSet[]>>(`${this.baseUrl}/question-sets/public`);
  }

  deleteQuestionSet(id: number, userId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/question-sets/${id}?userId=${userId}`);
  }

  // Answer API
  submitAnswer(data: { questionId: number; questionSetId?: number; answer: string; timeSpent?: number }, userId: number): Observable<ApiResponse<UserAnswer>> {
    return this.http.post<ApiResponse<UserAnswer>>(`${this.baseUrl}/answers/submit?userId=${userId}`, data);
  }

  getUserAnswers(userId: number): Observable<ApiResponse<UserAnswer[]>> {
    return this.http.get<ApiResponse<UserAnswer[]>>(`${this.baseUrl}/answers/user/${userId}`);
  }

  getUserAnswersByQuestionSet(userId: number, questionSetId: number): Observable<ApiResponse<UserAnswer[]>> {
    return this.http.get<ApiResponse<UserAnswer[]>>(`${this.baseUrl}/answers/user/${userId}/question-set/${questionSetId}`);
  }

  // Collection API
  addCollection(questionId: number, notes: string | undefined, userId: number): Observable<ApiResponse<Collection>> {
    const url = `${this.baseUrl}/collections?questionId=${questionId}&userId=${userId}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`;
    return this.http.post<ApiResponse<Collection>>(url, {});
  }

  removeCollection(id: number, userId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/collections/${id}?userId=${userId}`);
  }

  updateCollectionNotes(id: number, notes: string, userId: number): Observable<ApiResponse<Collection>> {
    return this.http.put<ApiResponse<Collection>>(`${this.baseUrl}/collections/${id}/notes?notes=${encodeURIComponent(notes)}&userId=${userId}`, {});
  }

  getUserCollections(userId: number): Observable<ApiResponse<Collection[]>> {
    return this.http.get<ApiResponse<Collection[]>>(`${this.baseUrl}/collections/user/${userId}`);
  }

  isCollected(userId: number, questionId: number): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/collections/check?userId=${userId}&questionId=${questionId}`);
  }

  // Knowledge Point API
  createKnowledgePoint(data: any, userId: number): Observable<ApiResponse<KnowledgePoint>> {
    return this.http.post<ApiResponse<KnowledgePoint>>(`${this.baseUrl}/knowledge-points?userId=${userId}`, data);
  }

  updateKnowledgePoint(id: number, data: any, userId: number): Observable<ApiResponse<KnowledgePoint>> {
    return this.http.put<ApiResponse<KnowledgePoint>>(`${this.baseUrl}/knowledge-points/${id}?userId=${userId}`, data);
  }

  getKnowledgePointById(id: number): Observable<ApiResponse<KnowledgePoint>> {
    return this.http.get<ApiResponse<KnowledgePoint>>(`${this.baseUrl}/knowledge-points/${id}`);
  }

  getAllKnowledgePoints(): Observable<ApiResponse<KnowledgePoint[]>> {
    return this.http.get<ApiResponse<KnowledgePoint[]>>(`${this.baseUrl}/knowledge-points`);
  }

  searchKnowledgePoints(params: { keyword?: string; difficulty?: string; category?: string; page?: number; size?: number }): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/knowledge-points/search`, { params: httpParams });
  }

  getKnowledgePointsByCreator(creatorId: number): Observable<ApiResponse<KnowledgePoint[]>> {
    return this.http.get<ApiResponse<KnowledgePoint[]>>(`${this.baseUrl}/knowledge-points/creator/${creatorId}`);
  }

  getKnowledgePointsByCategory(category: string, page?: number, size?: number): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    if (page !== undefined) httpParams = httpParams.set('page', page.toString());
    if (size !== undefined) httpParams = httpParams.set('size', size.toString());
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/knowledge-points/category/${category}`, { params: httpParams });
  }

  deleteKnowledgePoint(id: number, userId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/knowledge-points/${id}?userId=${userId}`);
  }

  // AI Service API
  generateExplanation(data: { questionTitle: string; questionContent: string; answer: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/ai/explain`, data);
  }

  gradeEssay(data: { questionContent: string; expectedAnswer: string; studentAnswer: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/ai/grade-essay`, data);
  }

  generateStudySuggestion(data: { userId: number; userStatistics: any }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/ai/study-suggestion`, data);
  }

  // Exam Paper API
  createExamPaper(data: any, userId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/exam-papers?userId=${userId}`, data);
  }

  updateExamPaper(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/exam-papers/${id}`, data);
  }

  publishExamPaper(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/exam-papers/${id}/publish`, {});
  }

  getExamPaperById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/exam-papers/${id}`);
  }

  getAllExamPapers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/exam-papers`);
  }

  getPublicExamPapers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/exam-papers/public`);
  }

  getExamPapersByCreator(creatorId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/exam-papers/creator/${creatorId}`);
  }

  getExamPapersByStatus(status: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/exam-papers/status/${status}`);
  }

  searchExamPapers(keyword?: string, isPublic?: boolean): Observable<ApiResponse<any[]>> {
    let httpParams = new HttpParams();
    if (keyword) httpParams = httpParams.set('keyword', keyword);
    if (isPublic !== undefined) httpParams = httpParams.set('isPublic', isPublic.toString());
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/exam-papers/search`, { params: httpParams });
  }

  deleteExamPaper(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/exam-papers/${id}`);
  }

  // Statistics API
  getExamPaperStatistics(examPaperId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/statistics/exam-paper/${examPaperId}`);
  }

  getUserStatistics(userId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/statistics/user/${userId}`);
  }

  getQuestionStatistics(questionId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/statistics/question/${questionId}`);
  }

  // Recommendation API
  getRecommendationsForUser(userId: number, limit: number = 10): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.baseUrl}/recommendations/user/${userId}?limit=${limit}`);
  }

  getSimilarQuestions(questionId: number, limit: number = 5): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.baseUrl}/recommendations/similar/${questionId}?limit=${limit}`);
  }

  getRecommendationsByDifficulty(difficulty: string, limit: number = 10): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.baseUrl}/recommendations/difficulty/${difficulty}?limit=${limit}`);
  }

  getSmartRecommendations(userId: number, limit: number = 10): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.baseUrl}/recommendations/smart/${userId}?limit=${limit}`);
  }
}
