import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'projects', 
    component: ProjectListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'users', 
    component: UserListComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/projects' }
]; 