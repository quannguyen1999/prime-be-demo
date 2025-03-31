import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    ProjectListComponent,
    AddProjectDialogComponent
  ],
  exports: [
    ProjectListComponent
  ]
})
export class ProjectModule { } 