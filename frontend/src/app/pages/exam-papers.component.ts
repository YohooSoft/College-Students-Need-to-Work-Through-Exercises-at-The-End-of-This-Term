import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-exam-papers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="exam-papers-container">
      <h1 class="page-title">试卷管理</h1>
      
      <!-- Tab Navigation -->
      <div class="tabs">
        <button 
          [class.active]="activeTab === 'all'" 
          (click)="switchTab('all')">
          全部试卷
        </button>
        <button 
          [class.active]="activeTab === 'public'" 
          (click)="switchTab('public')">
          公开试卷
        </button>
        <button 
          [class.active]="activeTab === 'mine'" 
          (click)="switchTab('mine')">
          我的试卷
        </button>
        <button 
          [class.active]="activeTab === 'create'" 
          (click)="switchTab('create')">
          创建试卷
        </button>
      </div>

      <!-- Exam Papers List -->
      <div *ngIf="activeTab !== 'create'" class="papers-list">
        <div class="search-bar">
          <input 
            type="text" 
            [(ngModel)]="searchKeyword" 
            placeholder="搜索试卷..."
            (keyup.enter)="searchPapers()">
          <button (click)="searchPapers()">搜索</button>
        </div>

        <div *ngIf="loading" class="loading">加载中...</div>
        
        <div *ngIf="!loading && examPapers.length === 0" class="no-data">
          暂无试卷数据
        </div>

        <div class="papers-grid">
          <div *ngFor="let paper of examPapers" class="paper-card">
            <div class="card-header">
              <h3>{{ paper.title }}</h3>
              <span class="status" [ngClass]="'status-' + paper.status?.toLowerCase()">
                {{ getStatusText(paper.status) }}
              </span>
            </div>
            <div class="card-body">
              <p class="description">{{ paper.description }}</p>
              <div class="info-row">
                <span><i class="icon">📝</i> {{ paper.questions?.length || 0 }} 题</span>
                <span><i class="icon">⏱️</i> {{ paper.timeLimit || 0 }} 分钟</span>
                <span><i class="icon">💯</i> 总分: {{ paper.totalScore || 0 }}</span>
                <span><i class="icon">✅</i> 及格分: {{ paper.passScore || 0 }}</span>
              </div>
              <div class="meta">
                <span>创建者: {{ paper.creator?.username }}</span>
                <span>{{ paper.isPublic ? '公开' : '私有' }}</span>
              </div>
            </div>
            <div class="card-actions">
              <button (click)="viewPaper(paper.id)" class="btn-view">查看</button>
              <button *ngIf="paper.status === 'DRAFT' && isOwnPaper(paper)" 
                      (click)="publishPaper(paper.id)" 
                      class="btn-publish">发布</button>
              <button *ngIf="isOwnPaper(paper)" 
                      (click)="editPaper(paper.id)" 
                      class="btn-edit">编辑</button>
              <button (click)="viewStatistics(paper.id)" class="btn-stats">统计</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Exam Paper Form -->
      <div *ngIf="activeTab === 'create'" class="create-form">
        <h2>创建新试卷</h2>
        <form (ngSubmit)="createPaper()">
          <div class="form-group">
            <label>试卷标题 *</label>
            <input type="text" [(ngModel)]="newPaper.title" name="title" required>
          </div>

          <div class="form-group">
            <label>试卷描述</label>
            <textarea [(ngModel)]="newPaper.description" name="description" rows="4"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>时间限制(分钟)</label>
              <input type="number" [(ngModel)]="newPaper.timeLimit" name="timeLimit" min="1">
            </div>

            <div class="form-group">
              <label>总分</label>
              <input type="number" [(ngModel)]="newPaper.totalScore" name="totalScore" min="1">
            </div>

            <div class="form-group">
              <label>及格分</label>
              <input type="number" [(ngModel)]="newPaper.passScore" name="passScore" min="1">
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" [(ngModel)]="newPaper.isPublic" name="isPublic">
              公开试卷
            </label>
          </div>

          <div class="form-group">
            <label>选择题目</label>
            <button type="button" (click)="toggleQuestionSelector()" class="btn-select">
              选择题目 (已选: {{ selectedQuestions.length }})
            </button>
          </div>

          <div *ngIf="showQuestionSelector" class="question-selector">
            <h4>题库</h4>
            <div *ngFor="let question of availableQuestions" class="question-item">
              <label>
                <input 
                  type="checkbox" 
                  [checked]="isQuestionSelected(question.id)"
                  (change)="toggleQuestion(question.id)">
                <span>{{ question.title }} ({{ question.type }} - {{ question.difficulty }})</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">创建试卷</button>
            <button type="button" (click)="resetForm()" class="btn-cancel">重置</button>
          </div>
        </form>

        <div *ngIf="createMessage" [class]="createSuccess ? 'success-message' : 'error-message'">
          {{ createMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exam-papers-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-title {
      font-size: 2rem;
      margin-bottom: 20px;
      color: #2c3e50;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }

    .tabs button {
      padding: 10px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1rem;
      color: #666;
      transition: all 0.3s;
      border-bottom: 3px solid transparent;
    }

    .tabs button.active {
      color: #3498db;
      border-bottom-color: #3498db;
    }

    .search-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .search-bar input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .search-bar button {
      padding: 10px 20px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .loading, .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .papers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .paper-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      background: white;
    }

    .paper-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-header {
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .status-draft {
      background: #95a5a6;
    }

    .status-published {
      background: #27ae60;
    }

    .card-body {
      padding: 15px;
    }

    .description {
      color: #666;
      margin-bottom: 15px;
      min-height: 40px;
    }

    .info-row {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 10px;
      font-size: 0.9rem;
    }

    .icon {
      margin-right: 5px;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #999;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }

    .card-actions {
      padding: 10px 15px;
      background: #f8f9fa;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .card-actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
    }

    .btn-view {
      background: #3498db;
      color: white;
    }

    .btn-publish {
      background: #27ae60;
      color: white;
    }

    .btn-edit {
      background: #f39c12;
      color: white;
    }

    .btn-stats {
      background: #9b59b6;
      color: white;
    }

    .create-form {
      max-width: 800px;
      margin: 0 auto;
    }

    .create-form h2 {
      margin-bottom: 20px;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .btn-select {
      padding: 10px 20px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .question-selector {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      max-height: 300px;
      overflow-y: auto;
      background: #f8f9fa;
    }

    .question-item {
      padding: 8px;
      margin-bottom: 5px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .btn-submit {
      padding: 12px 30px;
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-cancel {
      padding: 12px 30px;
      background: #95a5a6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .success-message {
      padding: 15px;
      margin-top: 20px;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      color: #155724;
    }

    .error-message {
      padding: 15px;
      margin-top: 20px;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
    }
  `]
})
export class ExamPapersComponent implements OnInit {
  activeTab: 'all' | 'public' | 'mine' | 'create' = 'all';
  examPapers: any[] = [];
  availableQuestions: any[] = [];
  loading = false;
  searchKeyword = '';

  showQuestionSelector = false;
  selectedQuestions: number[] = [];

  newPaper = {
    title: '',
    description: '',
    timeLimit: 60,
    totalScore: 100,
    passScore: 60,
    isPublic: false,
    questionIds: [] as number[]
  };

  createMessage = '';
  createSuccess = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadAvailableQuestions();
  }

  switchTab(tab: 'all' | 'public' | 'mine' | 'create') {
    this.activeTab = tab;
    if (tab !== 'create') {
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    const user = this.authService.currentUser;

    let observable;
    switch (this.activeTab) {
      case 'all':
        observable = this.apiService.getAllExamPapers();
        break;
      case 'public':
        observable = this.apiService.getPublicExamPapers();
        break;
      case 'mine':
        observable = user ? this.apiService.getExamPapersByCreator(user.id) : null;
        break;
      default:
        observable = null;
    }

    if (observable) {
      observable.subscribe({
        next: (response) => {
          if (response.success) {
            this.examPapers = response.data || [];
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  loadAvailableQuestions() {
    this.apiService.getAllQuestions().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableQuestions = response.data || [];
        }
      }
    });
  }

  searchPapers() {
    if (!this.searchKeyword.trim()) {
      this.loadData();
      return;
    }

    this.loading = true;
    this.apiService.searchExamPapers(this.searchKeyword).subscribe({
      next: (response) => {
        if (response.success) {
          this.examPapers = response.data || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'DRAFT': '草稿',
      'PUBLISHED': '已发布',
      'STARTED': '进行中',
      'ENDED': '已结束',
      'ARCHIVED': '已归档'
    };
    return statusMap[status] || status;
  }

  isOwnPaper(paper: any): boolean {
    const user = this.authService.currentUser;
    return user && paper.creator && paper.creator.id === user.id;
  }

  viewPaper(id: number) {
    // Navigate to paper detail
    this.router.navigate(['/exam-paper', id]);
  }

  publishPaper(id: number) {
    if (confirm('确定要发布这份试卷吗？')) {
      this.apiService.publishExamPaper(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('试卷发布成功！');
            this.loadData();
          }
        }
      });
    }
  }

  editPaper(id: number) {
    // Navigate to edit page
    this.router.navigate(['/exam-paper', id, 'edit']);
  }

  viewStatistics(id: number) {
    // Navigate to statistics page
    this.router.navigate(['/statistics/exam-paper', id]);
  }

  toggleQuestionSelector() {
    this.showQuestionSelector = !this.showQuestionSelector;
  }

  isQuestionSelected(id: number): boolean {
    return this.selectedQuestions.includes(id);
  }

  toggleQuestion(id: number) {
    const index = this.selectedQuestions.indexOf(id);
    if (index > -1) {
      this.selectedQuestions.splice(index, 1);
    } else {
      this.selectedQuestions.push(id);
    }
  }

  createPaper() {
    const user = this.authService.currentUser;
    if (!user) {
      this.createMessage = '请先登录';
      this.createSuccess = false;
      return;
    }

    if (!this.newPaper.title.trim()) {
      this.createMessage = '请输入试卷标题';
      this.createSuccess = false;
      return;
    }

    this.newPaper.questionIds = this.selectedQuestions;

    this.apiService.createExamPaper(this.newPaper, user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.createMessage = '试卷创建成功！';
          this.createSuccess = true;
          setTimeout(() => {
            this.resetForm();
            this.switchTab('mine');
          }, 1500);
        } else {
          this.createMessage = response.message || '创建失败';
          this.createSuccess = false;
        }
      },
      error: (error) => {
        this.createMessage = '创建失败：' + error.message;
        this.createSuccess = false;
      }
    });
  }

  resetForm() {
    this.newPaper = {
      title: '',
      description: '',
      timeLimit: 60,
      totalScore: 100,
      passScore: 60,
      isPublic: false,
      questionIds: []
    };
    this.selectedQuestions = [];
    this.showQuestionSelector = false;
    this.createMessage = '';
  }
}
