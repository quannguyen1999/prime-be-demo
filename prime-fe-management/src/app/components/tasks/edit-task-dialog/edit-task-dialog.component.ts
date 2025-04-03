import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { TaskService, Task } from '../../../services/task.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class EditTaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  filteredUsers: Observable<any>;
  isLoading = false;
  statuses = ['BACK_LOG', 'DOING', 'ON_HOLD', 'DONE', 'ARCHIVED'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private userService: UserService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: [data.title, [Validators.required]],
      description: [data.description, [Validators.required]],
      assignedTo: [{ username: data.userName, id: data.assignedTo }, [Validators.required]],
      status: [data.status, [Validators.required]]
    });

    // Setup user search with autocomplete
    this.filteredUsers = this.taskForm.get('assignedTo')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const searchTerm = typeof value === 'string' ? value : value?.username || '';
        return this.userService.getUsers(0, 5, searchTerm);
      })
    );
  }

  ngOnInit(): void {}

  displayUserFn(user: any): string {
    return user && user.username ? user.username : '';
  }

  onSubmit(): void {
    if (this.taskForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formValue = this.taskForm.value;
      const taskData = {
        title: formValue.title,
        description: formValue.description,
        assignedTo: formValue.assignedTo?.username || formValue.assignedTo,
        status: formValue.status
      };

      this.taskService.updateTask(this.data.id, taskData).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          let errorMessage = 'Failed to update task';
          if (error.message === 'Task not found') {
            errorMessage = 'Task no longer exists';
          } else if (error.message === 'Invalid user') {
            errorMessage = 'Invalid user selected';
          }
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 