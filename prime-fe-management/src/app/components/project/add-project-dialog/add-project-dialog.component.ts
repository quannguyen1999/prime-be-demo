import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../services/project.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  styles: [`
    :host {
      display: block;
    }
    .form-field input, .form-field textarea {
      border-color: #e2e8f0;
    }
    .form-field input::placeholder, .form-field textarea::placeholder {
      color: #64748b;
    }
  `]
})
export class AddProjectDialogComponent {
  projectForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjectDialogComponent>,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      this.projectService.createProject(this.projectForm.value)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (project) => {
            this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            let errorMessage = 'Failed to create project';
            if (error.message === 'Invalid project name') {
              errorMessage = 'Invalid project name';
              this.projectForm.get('name')?.setErrors({ invalid: true });
            }
            this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
          }
        });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
} 