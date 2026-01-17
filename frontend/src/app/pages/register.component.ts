import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  fullName = '';
  error = '';
  success = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  handleSubmit(): void {
    this.error = '';
    this.success = '';

    this.apiService.register({
      username: this.username,
      password: this.password,
      email: this.email,
      fullName: this.fullName
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = '注册成功！正在跳转到登录页面...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.error = err.error?.message || '注册失败，请重试';
      }
    });
  }
}
