import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recommendations-container">
      <h1 class="page-title">智能题目推荐</h1>

      <div class="recommendation-sections">
        <!-- Smart Recommendations -->
        <section class="rec-section">
          <h2>🎯 智能推荐 (基于学习曲线)</h2>
          <p class="section-desc">根据您的学习进度和正确率，为您推荐最适合的题目</p>
          <button (click)="loadSmartRecommendations()" [disabled]="loading" class="btn-load">
            {{ loading ? '加载中...' : '获取智能推荐' }}
          </button>
          
          <div class="questions-grid" *ngIf="smartRecommendations.length > 0">
            <div *ngFor="let question of smartRecommendations" class="question-card" (click)="viewQuestion(question.id)">
              <div class="card-badge smart">智能推荐</div>
              <h3>{{ question.title }}</h3>
              <div class="question-meta">
                <span class="type">{{ question.type }}</span>
                <span class="difficulty" [class]="'diff-' + question.difficulty?.toLowerCase()">
                  {{ question.difficulty }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- User-Based Recommendations -->
        <section class="rec-section">
          <h2>💡 个性化推荐 (基于历史记录)</h2>
          <p class="section-desc">根据您的错题和薄弱点推荐相关题目</p>
          <button (click)="loadUserRecommendations()" [disabled]="loading" class="btn-load">
            {{ loading ? '加载中...' : '获取个性化推荐' }}
          </button>
          
          <div class="questions-grid" *ngIf="userRecommendations.length > 0">
            <div *ngFor="let question of userRecommendations" class="question-card" (click)="viewQuestion(question.id)">
              <div class="card-badge personalized">个性化</div>
              <h3>{{ question.title }}</h3>
              <div class="question-meta">
                <span class="type">{{ question.type }}</span>
                <span class="difficulty" [class]="'diff-' + question.difficulty?.toLowerCase()">
                  {{ question.difficulty }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Difficulty-Based Recommendations -->
        <section class="rec-section">
          <h2>📊 按难度推荐</h2>
          <div class="difficulty-buttons">
            <button (click)="loadByDifficulty('EASY')" class="btn-difficulty easy">
              简单题
            </button>
            <button (click)="loadByDifficulty('MEDIUM')" class="btn-difficulty medium">
              中等题
            </button>
            <button (click)="loadByDifficulty('HARD')" class="btn-difficulty hard">
              困难题
            </button>
          </div>
          
          <div class="questions-grid" *ngIf="difficultyRecommendations.length > 0">
            <div *ngFor="let question of difficultyRecommendations" class="question-card" (click)="viewQuestion(question.id)">
              <div class="card-badge difficulty">难度分类</div>
              <h3>{{ question.title }}</h3>
              <div class="question-meta">
                <span class="type">{{ question.type }}</span>
                <span class="difficulty" [class]="'diff-' + question.difficulty?.toLowerCase()">
                  {{ question.difficulty }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .recommendations-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-title {
      font-size: 2rem;
      margin-bottom: 30px;
      color: #2c3e50;
      text-align: center;
    }

    .recommendation-sections {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    .rec-section {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }

    .rec-section h2 {
      margin-bottom: 10px;
      color: #2c3e50;
    }

    .section-desc {
      color: #666;
      margin-bottom: 20px;
    }

    .btn-load {
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-load:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-load:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .difficulty-buttons {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .btn-difficulty {
      padding: 10px 25px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      color: white;
    }

    .btn-difficulty.easy {
      background: #27ae60;
    }

    .btn-difficulty.medium {
      background: #f39c12;
    }

    .btn-difficulty.hard {
      background: #e74c3c;
    }

    .btn-difficulty:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .questions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .question-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      background: white;
    }

    .question-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
      border-color: #3498db;
    }

    .card-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
    }

    .card-badge.smart {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .card-badge.personalized {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .card-badge.difficulty {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .question-card h3 {
      margin: 0 0 15px 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .question-meta {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .type {
      padding: 4px 12px;
      background: #ecf0f1;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #34495e;
    }

    .difficulty {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: bold;
      color: white;
    }

    .diff-easy {
      background: #27ae60;
    }

    .diff-medium {
      background: #f39c12;
    }

    .diff-hard {
      background: #e74c3c;
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  smartRecommendations: any[] = [];
  userRecommendations: any[] = [];
  difficultyRecommendations: any[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Auto-load smart recommendations on init
    this.loadSmartRecommendations();
  }

  loadSmartRecommendations() {
    const user = this.authService.currentUser;
    if (!user) {
      alert('请先登录');
      return;
    }

    this.loading = true;
    this.apiService.getSmartRecommendations(user.id, 10).subscribe({
      next: (response) => {
        if (response.success) {
          this.smartRecommendations = response.data || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadUserRecommendations() {
    const user = this.authService.currentUser;
    if (!user) {
      alert('请先登录');
      return;
    }

    this.loading = true;
    this.apiService.getRecommendationsForUser(user.id, 10).subscribe({
      next: (response) => {
        if (response.success) {
          this.userRecommendations = response.data || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadByDifficulty(difficulty: string) {
    this.loading = true;
    this.apiService.getRecommendationsByDifficulty(difficulty, 10).subscribe({
      next: (response) => {
        if (response.success) {
          this.difficultyRecommendations = response.data || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewQuestion(id: number) {
    this.router.navigate(['/question', id]);
  }
}
