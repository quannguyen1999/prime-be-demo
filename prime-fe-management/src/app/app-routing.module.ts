import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';
import { ProjectDetailsComponent } from './components/project/project-detail/project-detail.component';

export const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'project',
    component: ProjectListComponent
  },
  {
    path: 'project/:id',
    component: ProjectDetailsComponent
  },
  {
    path: 'tasks',
    component: TaskListComponent
  },
  {
    path: '',
    redirectTo: 'home', pathMatch: 'full'
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
