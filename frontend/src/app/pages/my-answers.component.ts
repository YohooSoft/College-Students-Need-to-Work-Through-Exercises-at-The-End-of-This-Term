import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { UserAnswer, User, UserStatistics } from '../models/models';
import { MarkdownRendererComponent } from '../components/markdown-renderer.component';

@Component({
  selector: 'app-my-answers',
  standalone: true,
  imports: [CommonModule, MarkdownRendererComponent],
  templateUrl: './my-answers.component.html',
  styleUrls: ['./my-answers.component.css']
})
export class MyAnswersComponent implements OnInit {
  user: User | null = null;
  statistics: UserStatistics | null = null;
  answers: UserAnswer[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    if (!this.user) return;

    this.loading = true;

    // Load user statistics
    this.apiService.getUserStatistics(this.user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.statistics = response.data;
        }
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load statistics:', error);
        this.changeDetector.markForCheck();
      }
    });

    // Load user answers
    this.apiService.getUserAnswers(this.user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.answers = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load answers:', error);
        this.loading = false;
      }
    });
  }

  getQuestionTypeLabel(type: string): string {
    const types: Record<string, string> = {
      SINGLE_CHOICE: '单选题',
      MULTIPLE_CHOICE: '多选题',
      TRUE_FALSE: '判断题',
      FILL_BLANK: '填空题',
      SHORT_ANSWER: '简答题',
      ESSAY: '概述题',
    };
    return types[type] || type;
  }

  getAccuracyRate(): string {
    if (!this.statistics || this.statistics.completedQuestionsCount === 0) {
      return '0.00';
    }
    const rate = (this.statistics.correctAnswersCount / this.statistics.completedQuestionsCount) * 100;
    return rate.toFixed(2);
  }
}

