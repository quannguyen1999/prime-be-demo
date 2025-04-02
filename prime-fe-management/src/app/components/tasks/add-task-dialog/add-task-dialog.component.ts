import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService, PaginatedResponse, Project } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
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
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
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
export class AddTaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  filteredProjects: Observable<PaginatedResponse<Project>>;
  filteredUsers: Observable<PaginatedResponse<any>>;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]]
    });

    // Setup project search with autocomplete
    this.filteredProjects = this.taskForm.get('projectId')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const searchTerm = typeof value === 'string' ? value : value?.name || '';
        return this.projectService.getProjects(0, 5, searchTerm);
      })
    );

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

  displayProjectFn(project: any): string {
    return project && project.name ? project.name : '';
  }

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
        projectId: formValue.projectId?.id || formValue.projectId,
        assignedTo: formValue.assignedTo?.username || formValue.assignedTo
      };

      this.taskService.createTask(taskData).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          let errorMessage = 'Failed to create task';
          if (error.message === 'Invalid user') {
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