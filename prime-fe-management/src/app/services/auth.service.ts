import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { API_CONFIG } from '../constants/constant-value-model';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface RegisterResponse {
  message: string;
  details?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  register(username: string, email: string, password: string): Observable<RegisterResponse> {  
  // return this.http.post<LoginResponse>(API_CONFIG.auth.tokenUrl, null, { params }).pipe(
    return this.http.post<RegisterResponse>(`${environment.userServiceUrl}/users`, {
      username,
      email,
      password,
      role: 'USER'
    },).pipe(
      tap(() => {
        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        const errorDetail = error.error?.details?.[0];
        switch (errorDetail) {
          case 'USER_INVALID':
            this.snackBar.open('Invalid user data', 'Close', { duration: 3000 });
            break;
          case 'USER_NAME_INVALID':
            this.snackBar.open('Invalid username format', 'Close', { duration: 3000 });
            break;
          case 'USER_NAME_EXISTS':
            this.snackBar.open('Username already exists', 'Close', { duration: 3000 });
            break;
          case 'USER_PASSWORD_INVALID':
            this.snackBar.open('Invalid password format', 'Close', { duration: 3000 });
            break;
          case 'USER_EMAIL_INVALID':
              this.snackBar.open('Invalid email format', 'Close', { duration: 3000 });
              break;
          case 'USER_EMAIL_EXISTS':
                this.snackBar.open('Email already exists', 'Close', { duration: 3000 });
                break;
          default:
            this.snackBar.open('Registration failed', 'Close', { duration: 3000 });
        }
        return throwError(() => error);
      })
    );
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', API_CONFIG.auth.grantType)
      .set('client_id', API_CONFIG.auth.clientId)
      .set('client_secret', API_CONFIG.auth.clientSecret);
    
    return this.http.post<LoginResponse>(API_CONFIG.auth.tokenUrl, null, { params }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        if (error.error?.error === 'access_denied') {
          this.snackBar.open('Wrong username or password', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('An error occurred', 'Close', { duration: 3000 });
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
} 