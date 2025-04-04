import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  userName: string;
  createAt: string;
  updatedAt: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  total: number;
  data: T[];
  __typename: string | null;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  assignedTo: string;
  projectId: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  assignedTo: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTasks(page: number = 0, size: number = 5, search?: string): Observable<PaginatedResponse<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('nameTask', search);
    }

    return this.http.get<PaginatedResponse<Task>>(`${environment.projectServiceUrl}/tasks/root`, {
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

  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${environment.projectServiceUrl}/tasks`, task, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (error.error?.details?.includes('USER_INVALID')) {
          return throwError(() => new Error('Invalid user'));
        }
        return throwError(() => error);
      })
    );
  }

  updateTask(taskId: string, task: UpdateTaskDto): Observable<Task> {
    const params = new HttpParams().set('taskId', taskId);

    return this.http.put<Task>(`${environment.projectServiceUrl}/tasks`, task, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (error.error?.details?.includes('TASK_NOT_EXISTS')) {
          return throwError(() => new Error('Task not found'));
        }
        if (error.error?.details?.includes('USER_INVALID')) {
          return throwError(() => new Error('Invalid user'));
        }
        return throwError(() => error);
      })
    );
  }

  deleteTask(taskId: string): Observable<{message: string}> {
    const params = new HttpParams().set('taskId', taskId);

    return this.http.delete(`${environment.projectServiceUrl}/tasks`, {
      headers: this.getHeaders(),
      params,
      responseType: 'text'
    }).pipe(
      map((message: string) => ({ message })),
      catchError(error => {
        if (error.error?.details?.includes('TASK_NOT_EXISTS')) {
          return throwError(() => new Error('Task not found'));
        }
        return throwError(() => error);
      })
    );
  }

  getProjectTasks(projectId: string, byMe: boolean = false): Observable<Task[]> {
    const params = new HttpParams()
      .set('projectId', projectId)
      .set('byMe', byMe.toString());

    return this.http.get<Task[]>(`${environment.projectServiceUrl}/tasks/projects`, {
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

  updateTaskStatus(taskId: string, status: string): Observable<Task> {
    const params = new HttpParams().set('taskId', taskId);
    const taskData: UpdateTaskDto = {
      title: '',  // These fields are required by the interface but not used for status update
      description: '',
      assignedTo: '',
      status: status
    };

    return this.http.put<Task>(`${environment.projectServiceUrl}/tasks`, taskData, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (error.error?.details?.includes('TASK_NOT_EXISTS')) {
          return throwError(() => new Error('Task not found'));
        }
        if (error.error?.details?.includes('USER_INVALID')) {
          return throwError(() => new Error('Invalid user'));
        }
        return throwError(() => error);
      })
    );
  }
} 