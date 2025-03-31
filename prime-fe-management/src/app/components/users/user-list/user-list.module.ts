import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { AddUserDialogModule } from '../add-user-dialog/add-user-dialog.module';

@NgModule({
  imports: [
    UserListComponent,
    TimeAgoPipe,
    AddUserDialogModule
  ]
})
export class UserListModule { } 