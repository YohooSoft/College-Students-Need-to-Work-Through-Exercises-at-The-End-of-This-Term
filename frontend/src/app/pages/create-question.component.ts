import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { User, Question } from '../models/models';

interface QuestionOption {
  key: string;
  value: string;
}

interface QuestionCreateRequest {
  title: string;
  content: string;
  type: string;
  difficulty: string;
  answer: string;
  explanation: string;
  tags: string;
  options?: string;
}

@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription?: Subscription;
  
  // Edit mode
  isEditMode = false;
  questionId?: number;
  
  // Form fields
  title = '';
  content = '';
  type: string = 'SINGLE_CHOICE';
  difficulty: string = 'MEDIUM';
  answer = '';
  explanation = '';
  tags = '';
  
  // Options for choice questions
  options: QuestionOption[] = [
    { key: 'A', value: '' },
    { key: 'B', value: '' },
    { key: 'C', value: '' },
    { key: 'D', value: '' }
  ];
  
  // UI state
  error = '';
  success = '';
  submitting = false;
  
  // Question types
  questionTypes = [
    { value: 'SINGLE_CHOICE', label: '单选题' },
    { value: 'MULTIPLE_CHOICE', label: '多选题' },
    { value: 'TRUE_FALSE', label: '判断题' },
    { value: 'FILL_BLANK', label: '填空题' },
    { value: 'SHORT_ANSWER', label: '简答题' },
    { value: 'ESSAY', label: '概述题' }
  ];
  
  // Difficulty levels
  difficultyLevels = [
    { value: 'EASY', label: '简单' },
    { value: 'MEDIUM', label: '中等' },
    { value: 'HARD', label: '困难' }
  ];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.questionId = +id;
      this.loadQuestion(this.questionId);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  get isChoiceQuestion(): boolean {
    return this.type === 'SINGLE_CHOICE' || this.type === 'MULTIPLE_CHOICE';
  }

  get isTrueFalseQuestion(): boolean {
    return this.type === 'TRUE_FALSE';
  }

  loadQuestion(id: number): void {
    this.apiService.getQuestionById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const question: Question = response.data;
          
          // Check if user is the creator
          if (!this.user || !question.creator || question.creator.id !== this.user.id) {
            this.error = '无权限编辑此题目';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
            return;
          }

          // Load question data into form
          this.title = question.title;
          this.content = question.content;
          this.type = question.type;
          this.difficulty = question.difficulty;
          this.answer = question.answer;
          this.explanation = question.explanation || '';
          this.tags = question.tags || '';

          // Load options for choice questions
          if (question.options) {
            try {
              const parsedOptions = JSON.parse(question.options);
              if (typeof parsedOptions === 'object') {
                this.options = Object.entries(parsedOptions).map(([key, value]) => ({
                  key,
                  value: String(value)
                }));
              }
            } catch (e) {
              console.error('Failed to parse options:', e);
            }
          }
        } else {
          this.error = response.message || '加载题目失败';
        }
      },
      error: (err) => {
        this.error = '加载题目失败';
        console.error('Failed to load question:', err);
      }
    });
  }

  addOption(): void {
    const nextKey = String.fromCharCode(65 + this.options.length); // A=65
    this.options.push({ key: nextKey, value: '' });
  }

  removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.splice(index, 1);
      // Re-assign keys
      this.options.forEach((opt, idx) => {
        opt.key = String.fromCharCode(65 + idx);
      });
    }
  }

  handleSubmit(): void {
    this.error = '';
    this.success = '';

    // Validation
    if (!this.title.trim()) {
      this.error = '请输入题目标题';
      return;
    }

    if (!this.content.trim()) {
      this.error = '请输入题目内容';
      return;
    }

    if (!this.answer.trim()) {
      this.error = '请输入答案';
      return;
    }

    if (this.isChoiceQuestion) {
      const hasEmptyOption = this.options.some(opt => !opt.value.trim());
      if (hasEmptyOption) {
        this.error = '请填写所有选项内容';
        return;
      }
    }

    if (!this.user) {
      this.error = '请先登录';
      return;
    }

    this.submitting = true;

    // Prepare request data
    const requestData: QuestionCreateRequest = {
      title: this.title.trim(),
      content: this.content.trim(),
      type: this.type,
      difficulty: this.difficulty,
      answer: this.answer.trim(),
      explanation: this.explanation.trim(),
      tags: this.tags.trim()
    };

    // Add options for choice questions
    if (this.isChoiceQuestion || this.isTrueFalseQuestion) {
      const optionsObj: Record<string, string> = {};
      if (this.isTrueFalseQuestion) {
        optionsObj['A'] = '正确';
        optionsObj['B'] = '错误';
      } else {
        this.options.forEach(opt => {
          if (opt.value.trim()) {
            optionsObj[opt.key] = opt.value.trim();
          }
        });
      }
      requestData.options = JSON.stringify(optionsObj);
    }

    // Call API - either create or update
    if (this.isEditMode && this.questionId) {
      this.apiService.updateQuestion(this.questionId, requestData, this.user.id).subscribe({
        next: (response) => {
          this.submitting = false;
          if (response.success) {
            this.success = '题目更新成功！正在跳转...';
            setTimeout(() => {
              this.router.navigate(['/questions', response.data.id]);
            }, 1500);
          } else {
            this.error = response.message || '更新失败';
          }
        },
        error: (err) => {
          this.submitting = false;
          this.error = err.error?.message || '更新失败，请重试';
        }
      });
    } else {
      // Call API
      this.apiService.createQuestion(requestData, this.user.id).subscribe({
        next: (response) => {
          this.submitting = false;
          if (response.success) {
            this.success = '题目创建成功！正在跳转...';
            setTimeout(() => {
              this.router.navigate(['/questions', response.data.id]);
            }, 1500);
          } else {
            this.error = response.message || '创建失败';
          }
        },
        error: (err) => {
          this.submitting = false;
          this.error = err.error?.message || '创建失败，请重试';
        }
      });
    }
  }

  resetForm(): void {
    this.title = '';
    this.content = '';
    this.type = 'SINGLE_CHOICE';
    this.difficulty = 'MEDIUM';
    this.answer = '';
    this.explanation = '';
    this.tags = '';
    this.options = [
      { key: 'A', value: '' },
      { key: 'B', value: '' },
      { key: 'C', value: '' },
      { key: 'D', value: '' }
    ];
    this.error = '';
    this.success = '';
  }
}
