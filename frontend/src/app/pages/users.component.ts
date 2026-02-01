import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { User, UserStatistics } from '../models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  searchKeyword = '';
  loading = false;
  selectedUser: User | null = null;
  selectedUserStats: UserStatistics | null = null;
  currentUser: User | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.loading = true;
    this.apiService.searchUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
          this.changeDetector.markForCheck();
        }
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.loading = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  handleSearch(): void {
    this.loading = true;
    this.apiService.searchUsers(this.searchKeyword).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
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

  viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.apiService.getUserStatistics(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedUserStats = response.data;
        }
      },
      error: (error) => {
        console.error('Failed to load user statistics:', error);
      }
    });
  }

  closeUserDetails(): void {
    this.selectedUser = null;
    this.selectedUserStats = null;
  }

  getRoleLabel(role: string): string {
    if (role === 'SVIP') return 'SVIP会员';
    if (role === 'VIP') return 'VIP会员';
    return '普通用户';
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'SVIP') return 'badge-svip';
    if (role === 'VIP') return 'badge-vip';
    return 'badge-normal';
  }
}
