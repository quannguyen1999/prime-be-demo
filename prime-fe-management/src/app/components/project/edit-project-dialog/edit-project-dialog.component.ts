import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService, Project } from '../../../services/project.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
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
  ]
})
export class EditProjectDialogComponent {
  projectForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProjectDialogComponent>,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: { project: Project }
  ) {
    this.projectForm = this.fb.group({
      name: [data.project.name, [Validators.required]],
      description: [data.project.description, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      this.projectService.updateProject(this.data.project.id, this.projectForm.value)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            let errorMessage = 'Failed to update project';
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