import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
import { ActivityLogListComponent } from './components/activityLogs/activity-log-list/activity-log-list.component';
import { ActivityLogDetailComponent } from './components/activityLogs/activity-log-detail/activity-log-detail.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';
import { ProjectDetailsComponent } from './components/project/project-detail/project-detail.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    // Standalone Components
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SideBarComponent,
    RegisterComponent,
    UserDetailComponent,
    TaskDetailComponent,
    ActivityLogListComponent,
    ActivityLogDetailComponent,
    PageNotFoundComponent,
    ProjectDetailsComponent
  ],
  providers: []
})
export class AppModule { }
