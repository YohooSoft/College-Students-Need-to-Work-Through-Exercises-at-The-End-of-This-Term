import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './models/models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  user: User | null = null;

  constructor(public authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
