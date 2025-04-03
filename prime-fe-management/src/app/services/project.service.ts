import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export interface Project {
  id: string;
  name: string;
  description: string;
  createAt: string | null;
  updatedAt: string | null;
  ownerId: string;
  ownerUsername: string;
  status?: string;
}

export interface ProjectMember {
  id: string;
  username: string;
  totalTasks: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  members: ProjectMember[];
  completionPercentage: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface ProjectStatistics {
  statusCounts: StatusCount[];
  projectSummaries: ProjectSummary[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
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

export interface StatusBreakdown {
  backlogTasks: number;
  doingTasks: number;
  onHoldTasks: number;
  doneTasks: number;
  archivedTasks: number;
  backlogPercentage: number;
  doingPercentage: number;
  onHoldPercentage: number;
  donePercentage: number;
  archivedPercentage: number;
}

export interface ProjectStat {
  projectName: string;
  totalTasks: number;
  completionPercentage: number;
  statusBreakdown: StatusBreakdown;
}

export interface OverallStatistics {
  totalProjects: number;
  totalTasks: number;
  projectStats: ProjectStat[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  projectId: string;
  projectName: string;
  action: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED';
  timestamp: number;
}

export interface ActivityLogResponse {
  page: number;
  size: number;
  total: number;
  data: ActivityLog[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProjects(page: number = 0, size: number = 5, search?: string): Observable<PaginatedResponse<Project>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('name', search);
    }

    return this.http.get<PaginatedResponse<Project>>(`${environment.projectServiceUrl}/projects`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        console.error('Error fetching projects:', error);
        return throwError(() => error);
      })
    );
  }

  createProject(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${environment.projectServiceUrl}/projects`, project, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.error?.details?.includes('PRODUCT_NAME_INVALID')) {
          return throwError(() => new Error('Invalid project name'));
        }
        return throwError(() => error);
      })
    );
  }

  updateProject(projectId: string, project: CreateProjectDto): Observable<Project> {
    const params = new HttpParams().set('projectId', projectId);
    
    return this.http.put<Project>(`${environment.projectServiceUrl}/projects`, project, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(error => {
        if (error.error?.details?.includes('PRODUCT_NAME_INVALID')) {
          return throwError(() => new Error('Invalid project name'));
        }
        return throwError(() => error);
      })
    );
  }

  deleteProject(projectId: string): Observable<{ message: string }> {
    const params = new HttpParams().set('projectId', projectId);
    
    return this.http.delete(`${environment.projectServiceUrl}/projects`, {
      headers: this.getHeaders(),
      params,
      responseType: 'text'
    }).pipe(
      map(message => ({ message })),
      catchError(error => {
        if (error.error?.details?.includes('PROJECT_INVALID')) {
          return throwError(() => new Error('Invalid project'));
        }
        return throwError(() => error);
      })
    );
  }

  getProjectStatistics(): Observable<ProjectStatistics> {
    return this.http.get<ProjectStatistics>(`${environment.projectServiceUrl}/projects/statistics`, {
      headers: this.getHeaders()
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

  getOverallStatistics(): Observable<OverallStatistics> {
    return this.http.get<OverallStatistics>(`${environment.projectServiceUrl}/projects/overall-statistics`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  getActivityLogs(page: number = 0, size: number = 5): Observable<PaginatedResponse<ActivityLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<ActivityLog>>(
      `${environment.projectServiceUrl}/activity-logs`,
      { 
        params,
        headers: this.getHeaders()
      }
    ).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        throw error;
      })
    );
  }
} 