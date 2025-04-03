import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  role: string;
}

export interface UpdateUserDto {
  username: string;
  email: string;
  role: string;
}

export interface ErrorResponse {
  message: string;
  details: string[];
}

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  total: number;
  data: T[];
  __typename: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user-service/users`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsers(page: number = 0, size: number = 5, search: string = ''): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('username', search);
    }

    return this.http.get<PaginatedResponse<User>>(this.apiUrl, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (error.error?.details?.includes('USER_NAME_EXISTS')) {
          return throwError(() => new Error('Username already exists'));
        }
        return throwError(() => error);
      })
    );
  }

  updateUser(user: UpdateUserDto): Observable<User> {
    return this.http.put<User>(this.apiUrl, user, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (error.error?.details?.includes('USER_INVALID')) {
          return throwError(() => new Error('Invalid user data'));
        }
        if (error.error?.details?.includes('USER_EMAIL_EXISTS')) {
          return throwError(() => new Error('Email already exists'));
        }
        return throwError(() => error);
      })
    );
  }
} 