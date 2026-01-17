import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  handleSubmit(): void {
    this.error = '';

    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        if (response.success) {
          this.authService.login(response.data);
          this.router.navigate(['/']);
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.error = err.error?.message || '登录失败，请重试';
      }
    });
  }
}
