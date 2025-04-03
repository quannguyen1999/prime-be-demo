import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProjectDetailComponent } from './components/project/project-detail/project-detail.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'team',
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:id',
    component: ProjectDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    redirectTo: 'home', // Temporary redirect until settings component is created
    pathMatch: 'full'
  },
  {
    path: 'logout',
    component: SidebarComponent,
    resolve: {
      logout: () => {
        const authService = inject(AuthService);
        authService.logout();
        return true;
      }
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
