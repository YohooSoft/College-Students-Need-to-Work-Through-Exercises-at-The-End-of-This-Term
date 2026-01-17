import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Question, User } from '../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  questions: Question[] = [];
  searchKeyword = '';
  loading = true;
  user: User | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.apiService.getAllQuestions().subscribe({
      next: (response) => {
        if (response.success) {
          this.questions = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load questions:', error);
        this.loading = false;
      }
    });
  }

  handleSearch(): void {
    this.loading = true;
    this.apiService.searchQuestions({ keyword: this.searchKeyword }).subscribe({
      next: (response) => {
        if (response.success) {
          this.questions = response.data.content || response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Search failed:', error);
        this.loading = false;
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.handleSearch();
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

  getRoleLabel(role: string): string {
    if (role === 'SVIP') return 'SVIP会员';
    if (role === 'VIP') return 'VIP会员';
    return '普通用户';
  }

  getTags(tagsString?: string): string[] {
    return tagsString ? tagsString.split(',') : [];
  }
}
