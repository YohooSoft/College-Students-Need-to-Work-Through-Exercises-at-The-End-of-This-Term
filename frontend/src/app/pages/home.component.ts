import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Question, User } from '../models/models';
import { MarkdownRendererComponent } from '../components/markdown-renderer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MarkdownRendererComponent],
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
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
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
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load questions:', error);
        this.loading = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  handleSearch(): void {
    this.loading = true;
    this.apiService.searchQuestions({ keyword: this.searchKeyword }).subscribe({
      next: (response) => {
        if (response.success) {
          this.questions = response.data.content || response.data;
          this.changeDetector.markForCheck();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Search failed:', error);
        this.loading = false;
        this.changeDetector.markForCheck();
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

  getPreviewContent(content: string, maxLength: number = 200): string {
    if (!content || content.length <= maxLength) {
      return content;
    }
    
    // Simple truncation that tries to avoid breaking in the middle of markdown/latex
    let truncated = content.substring(0, maxLength);
    
    // If we're in the middle of a LaTeX expression, extend to include it
    const openDollarCount = (truncated.match(/\$/g) || []).length;
    if (openDollarCount % 2 !== 0) {
      // Odd number of $ signs means we cut in the middle of a formula
      const nextDollar = content.indexOf('$', maxLength);
      if (nextDollar !== -1 && nextDollar < maxLength + 50) {
        truncated = content.substring(0, nextDollar + 1);
      }
    }
    
    return truncated + '...';
  }

  isCreator(question: Question): boolean {
    return this.user !== null && question.creator !== undefined && question.creator.id === this.user.id;
  }

  editQuestion(questionId: number): void {
    this.router.navigate(['/questions/edit', questionId]);
  }

  deleteQuestion(question: Question): void {
    if (!this.user || !this.isCreator(question)) {
      alert('无权限删除此题目');
      return;
    }

    // Sanitize title for display in confirmation dialog
    const sanitizedTitle = question.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    if (confirm(`确定要删除题目 "${sanitizedTitle}" 吗？此操作不可恢复。`)) {
      this.apiService.deleteQuestion(question.id, this.user.id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('删除成功');
            this.loadQuestions();
          } else {
            alert('删除失败: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Failed to delete question:', error);
          alert('删除失败');
        }
      });
    }
  }
}
