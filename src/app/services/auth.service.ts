// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import * as jwt_decode from 'jwt-decode';

export interface JwtPayload {
  sub: string;      // обычно nickname
  exp: number;      // время истечения (в секундах с 1970-01-01)
  iat: number;      // время выпуска
  // ... и любые другие поля, которые вы положили в токен
}

export interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(dto: { email: string; password: string; }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', dto)
      .pipe(
        tap(res => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.currentUserSubject.next(res);
        })
      );
  }

  register(dto: { nickname: string; email: string; password: string; }): Observable<any> {
    return this.api.post<any>('auth/register', dto);
  }

  /** Проверить, что пользователь залогинен и токен ещё живой **/
  isLoggedIn(): boolean {
    return !!this.token && !this.isTokenExpired();
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get token(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  /** Раскодировать payload из токена **/
  get decodedToken(): JwtPayload | null {
    if (!this.token) return null;
    try {
      return (jwt_decode as any)(this.token) as JwtPayload;
    } catch {
      return null;
    }
  }

  /** Проверить, что токен ещё действителен **/
  isTokenExpired(): boolean {
    const payload = this.decodedToken;
    if (!payload) return true;
    // exp указан в секундах
    return payload.exp * 1000 < Date.now();
  }

  /** Проверить, что пользователь залогинен и токен ещё живой **/
}
