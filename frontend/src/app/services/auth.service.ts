import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor() {
    const savedUser = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.user$ = this.userSubject.asObservable();
  }

  get user(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  login(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }
}
