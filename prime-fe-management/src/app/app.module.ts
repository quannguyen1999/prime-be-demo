import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListModule } from './components/users/user-list/user-list.module';
import { ProjectModule } from './components/project/project.module';
import { TaskModule } from './components/tasks/task.module';
import { DashboardModule } from './components/dashboard/dashboard.module';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { RegisterComponent } from './components/register/register.component';
import { ProjectDetailComponent } from './components/project/project-detail/project-detail.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
import { ActivityLogListComponent } from './components/activityLogs/activity-log-list/activity-log-list.component';
import { ActivityLogDetailComponent } from './components/activityLogs/activity-log-detail/activity-log-detail.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    RegisterComponent,
    ProjectDetailComponent,
    UserDetailComponent,
    TaskDetailComponent,
    ActivityLogListComponent,
    ActivityLogDetailComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // PrimeNG
    ButtonModule,
    InputTextModule,
    TableModule,
    CardModule,
    // Angular Material
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    // Standalone Components
    LoginComponent,
    HeaderComponent,
    // Feature Modules
    UserListModule,
    ProjectModule,
    TaskModule,
    DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
