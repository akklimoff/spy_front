// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import * as jwt_decode from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  nickname: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Храним currentUser (AuthResponse) или null
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Дополнительно: булево, залогинен ли пользователь (true/false)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private api: ApiService) {
    // при старте приложения посмотрим localStorage
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored) as AuthResponse;
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(!this.isTokenExpired());
    }
  }

  login(dto: { nickname: string; password: string; }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', dto).pipe(
      tap(res => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(dto: { nickname: string; email: string; password: string; }): Observable<any> {
    return this.api.post<any>('auth/register', dto);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /** Просто геттер для извлечения raw-токена **/
  get token(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  /** Раскодируем payload из токена **/
  get decodedToken(): JwtPayload | null {
    if (!this.token) return null;
    try {
      return (jwt_decode as any)(this.token) as JwtPayload;
    } catch {
      return null;
    }
  }

  /** Проверяем, что токен ещё живой **/
  isTokenExpired(): boolean {
    const payload = this.decodedToken;
    if (!payload) return true;
    return payload.exp * 1000 < Date.now();
  }
}
