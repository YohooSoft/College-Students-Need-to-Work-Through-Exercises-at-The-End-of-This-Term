import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-grade-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="statistics-container">
      <h1 class="page-title">成绩统计分析</h1>

      <!-- Tab Navigation -->
      <div class="tabs">
        <button 
          [class.active]="viewType === 'user'" 
          (click)="switchView('user')">
          我的统计
        </button>
        <button 
          [class.active]="viewType === 'exam'" 
          (click)="switchView('exam')">
          试卷统计
        </button>
      </div>

      <!-- User Statistics -->
      <div *ngIf="viewType === 'user' && userStats" class="stats-section">
        <h2>个人学习统计</h2>
        
        <div class="stats-grid">
          <div class="stat-card card-primary">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.totalExams || 0 }}</div>
              <div class="stat-label">总考试次数</div>
            </div>
          </div>

          <div class="stat-card card-success">
            <div class="stat-icon">💯</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.averageScore || 0 }}</div>
              <div class="stat-label">平均分数</div>
            </div>
          </div>

          <div class="stat-card card-info">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.correctRate || 0 }}%</div>
              <div class="stat-label">正确率</div>
            </div>
          </div>

          <div class="stat-card card-warning">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.totalQuestions || 0 }}</div>
              <div class="stat-label">总答题数</div>
            </div>
          </div>

          <div class="stat-card card-purple">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.passRate || 0 }}%</div>
              <div class="stat-label">通过率</div>
            </div>
          </div>

          <div class="stat-card card-teal">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.correctAnswers || 0 }}</div>
              <div class="stat-label">正确答题数</div>
            </div>
          </div>
        </div>

        <!-- AI Study Suggestion -->
        <div class="ai-section">
          <h3>AI学习建议</h3>
          <button 
            (click)="generateStudySuggestion()" 
            [disabled]="generatingAI"
            class="btn-ai">
            {{ generatingAI ? '生成中...' : '获取AI学习建议' }}
          </button>
          
          <div *ngIf="aiSuggestion" class="ai-suggestion">
            <div class="suggestion-header">
              <span class="ai-badge">🤖 AI建议</span>
            </div>
            <div class="suggestion-content">{{ aiSuggestion }}</div>
          </div>
        </div>
      </div>

      <!-- Exam Paper Statistics -->
      <div *ngIf="viewType === 'exam'" class="stats-section">
        <div class="exam-selector">
          <label>选择试卷：</label>
          <select [(ngModel)]="selectedExamId" (change)="loadExamStats()">
            <option [value]="null">请选择试卷</option>
            <option *ngFor="let paper of examPapers" [value]="paper.id">
              {{ paper.title }}
            </option>
          </select>
        </div>

        <div *ngIf="examStats" class="exam-stats">
          <h2>试卷统计分析</h2>
          
          <div class="stats-grid">
            <div class="stat-card card-primary">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-value">{{ examStats.totalSubmissions || 0 }}</div>
                <div class="stat-label">总提交次数</div>
              </div>
            </div>

            <div class="stat-card card-success">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <div class="stat-value">{{ examStats.averageScore || 0 }}</div>
                <div class="stat-label">平均分</div>
              </div>
            </div>

            <div class="stat-card card-info">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value">{{ examStats.passRate || 0 }}%</div>
                <div class="stat-label">通过率</div>
              </div>
            </div>

            <div class="stat-card card-warning">
              <div class="stat-icon">🏆</div>
              <div class="stat-content">
                <div class="stat-value">{{ examStats.maxScore || 0 }}</div>
                <div class="stat-label">最高分</div>
              </div>
            </div>

            <div class="stat-card card-danger">
              <div class="stat-icon">📉</div>
              <div class="stat-content">
                <div class="stat-value">{{ examStats.minScore || 0 }}</div>
                <div class="stat-label">最低分</div>
              </div>
            </div>
          </div>

          <!-- Score Distribution -->
          <div class="score-distribution">
            <h3>分数分布</h3>
            <div class="distribution-bars">
              <div *ngFor="let range of getScoreRanges()" class="distribution-bar">
                <div class="bar-label">{{ range.label }}</div>
                <div class="bar-container">
                  <div class="bar-fill" [style.width.%]="range.percentage"></div>
                  <span class="bar-value">{{ range.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-title {
      font-size: 2rem;
      margin-bottom: 20px;
      color: #2c3e50;
      text-align: center;
    }

    .tabs {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 30px;
      border-bottom: 2px solid #e0e0e0;
    }

    .tabs button {
      padding: 10px 30px;
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

    .stats-section h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 3rem;
      opacity: 0.8;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }

    .card-primary { border-left: 4px solid #3498db; }
    .card-primary .stat-value { color: #3498db; }

    .card-success { border-left: 4px solid #27ae60; }
    .card-success .stat-value { color: #27ae60; }

    .card-info { border-left: 4px solid #17a2b8; }
    .card-info .stat-value { color: #17a2b8; }

    .card-warning { border-left: 4px solid #f39c12; }
    .card-warning .stat-value { color: #f39c12; }

    .card-purple { border-left: 4px solid #9b59b6; }
    .card-purple .stat-value { color: #9b59b6; }

    .card-teal { border-left: 4px solid #1abc9c; }
    .card-teal .stat-value { color: #1abc9c; }

    .card-danger { border-left: 4px solid #e74c3c; }
    .card-danger .stat-value { color: #e74c3c; }

    .ai-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      border-radius: 12px;
      color: white;
      margin-top: 30px;
    }

    .ai-section h3 {
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .btn-ai {
      padding: 12px 30px;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-ai:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .btn-ai:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .ai-suggestion {
      margin-top: 20px;
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }

    .suggestion-header {
      margin-bottom: 15px;
    }

    .ai-badge {
      background: rgba(255,255,255,0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: bold;
    }

    .suggestion-content {
      line-height: 1.8;
      white-space: pre-wrap;
    }

    .exam-selector {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .exam-selector label {
      font-weight: 500;
      color: #2c3e50;
    }

    .exam-selector select {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .score-distribution {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-top: 30px;
    }

    .score-distribution h3 {
      margin-bottom: 20px;
      color: #2c3e50;
    }

    .distribution-bars {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .distribution-bar {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .bar-label {
      width: 80px;
      font-weight: 500;
      color: #2c3e50;
    }

    .bar-container {
      flex: 1;
      height: 40px;
      background: #f0f0f0;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      transition: width 0.5s ease;
      border-radius: 20px;
    }

    .bar-value {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
      color: #2c3e50;
    }

    .loading {
      text-align: center;
      padding: 60px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 20px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class GradeStatisticsComponent implements OnInit {
  viewType: 'user' | 'exam' = 'user';
  userStats: any = null;
  examStats: any = null;
  examPapers: any[] = [];
  selectedExamId: number | null = null;
  loading = false;
  generatingAI = false;
  aiSuggestion = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if there's an exam ID in the route
    this.route.params.subscribe(params => {
      if (params['examId']) {
        this.selectedExamId = +params['examId'];
        this.viewType = 'exam';
        this.loadExamStats();
      } else {
        this.loadUserStats();
      }
    });

    this.loadExamPapers();
  }

  switchView(type: 'user' | 'exam') {
    this.viewType = type;
    if (type === 'user') {
      this.loadUserStats();
    } else {
      if (this.selectedExamId) {
        this.loadExamStats();
      }
    }
  }

  loadUserStats() {
    const user = this.authService.currentUser;
    if (!user) return;

    this.loading = true;
    this.apiService.getUserStatistics(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.userStats = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadExamStats() {
    if (!this.selectedExamId) return;

    this.loading = true;
    this.apiService.getExamPaperStatistics(this.selectedExamId).subscribe({
      next: (response) => {
        if (response.success) {
          this.examStats = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadExamPapers() {
    this.apiService.getAllExamPapers().subscribe({
      next: (response) => {
        if (response.success) {
          this.examPapers = response.data || [];
        }
      }
    });
  }

  generateStudySuggestion() {
    const user = this.authService.currentUser;
    if (!user || !this.userStats) return;

    this.generatingAI = true;
    this.apiService.generateStudySuggestion({
      userId: user.id,
      userStatistics: this.userStats
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.aiSuggestion = response.data;
        }
        this.generatingAI = false;
      },
      error: () => {
        this.generatingAI = false;
      }
    });
  }

  getScoreRanges() {
    if (!this.examStats || !this.examStats.scoreDistribution) {
      return [];
    }

    const distribution = this.examStats.scoreDistribution;
    const total = this.examStats.totalSubmissions || 1;

    return [
      { label: '0-59', count: distribution['0-59'] || 0, percentage: ((distribution['0-59'] || 0) / total) * 100 },
      { label: '60-69', count: distribution['60-69'] || 0, percentage: ((distribution['60-69'] || 0) / total) * 100 },
      { label: '70-79', count: distribution['70-79'] || 0, percentage: ((distribution['70-79'] || 0) / total) * 100 },
      { label: '80-89', count: distribution['80-89'] || 0, percentage: ((distribution['80-89'] || 0) / total) * 100 },
      { label: '90-100', count: distribution['90-100'] || 0, percentage: ((distribution['90-100'] || 0) / total) * 100 }
    ];
  }
}
