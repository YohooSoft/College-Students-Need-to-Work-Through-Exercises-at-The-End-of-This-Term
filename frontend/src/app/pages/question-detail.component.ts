import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Question, User } from '../models/models';
import { MarkdownRendererComponent } from '../components/markdown-renderer.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownRendererComponent],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {
  question: Question | null = null;
  user: User | null = null;
  userAnswer = '';
  selectedOptions: string[] = [];
  submitted = false;
  isCorrect = false;
  score = 0;
  loading = true;
  isCollected = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private  changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuestion(+id);
    }
  }

  loadQuestion(id: number): void {
    this.loading = true;
    this.apiService.getQuestionById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.question = response.data;
          this.checkIfCollected();
        }
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load question:', error);
        this.loading = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  checkIfCollected(): void {
    if (this.user && this.question) {
      this.apiService.isCollected(this.user.id, this.question.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.isCollected = response.data;
          }
        },
        error: (error) => {
          console.error('Failed to check collection status:', error);
        }
      });
    }
  }

  getOptions(): any[] {
    if (!this.question?.options) return [];
    try {
      return JSON.parse(this.question.options);
    } catch {
      return [];
    }
  }

  toggleOption(optionKey: string): void {
    const index = this.selectedOptions.indexOf(optionKey);
    if (index === -1) {
      if (this.question?.type === 'SINGLE_CHOICE') {
        this.selectedOptions = [optionKey];
      } else {
        this.selectedOptions.push(optionKey);
      }
    } else {
      this.selectedOptions.splice(index, 1);
    }
  }

  submitAnswer(): void {
    if (!this.user || !this.question) return;

    let answer = this.userAnswer;
    if (this.question.type === 'SINGLE_CHOICE' || this.question.type === 'TRUE_FALSE') {
      answer = this.selectedOptions[0] || '';
    } else if (this.question.type === 'MULTIPLE_CHOICE') {
      answer = this.selectedOptions.sort().join(',');
    }

    this.apiService.submitAnswer({
      questionId: this.question.id,
      answer: answer,
      timeSpent: 0
    }, this.user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.submitted = true;
          this.isCorrect = response.data.isCorrect;
          this.score = response.data.score;
        }
      },
      error: (error) => {
        console.error('Failed to submit answer:', error);
        alert('提交失败');
      }
    });
  }

  toggleCollection(): void {
    if (!this.user || !this.question) return;

    if (this.isCollected) {
      // Remove from collection - we need collection ID
      // For simplicity, we'll just show a message
      alert('取消收藏功能需要从收藏列表中操作');
    } else {
      this.apiService.addCollection(this.question.id, undefined, this.user.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.isCollected = true;
            alert('收藏成功！');
          }
        },
        error: (error) => {
          console.error('Failed to add collection:', error);
          alert('收藏失败');
        }
      });
    }
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

  getDifficultyLabel(difficulty: string): string {
    const levels: Record<string, string> = {
      EASY: '简单',
      MEDIUM: '中等',
      HARD: '困难',
    };
    return levels[difficulty] || difficulty;
  }

  isChoiceQuestion(): boolean {
    return this.question?.type === 'SINGLE_CHOICE' || 
           this.question?.type === 'MULTIPLE_CHOICE' || 
           this.question?.type === 'TRUE_FALSE';
  }
}

