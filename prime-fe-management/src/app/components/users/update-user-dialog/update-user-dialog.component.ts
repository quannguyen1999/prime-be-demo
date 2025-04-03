import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService, User } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user-dialog',
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-medium text-gray-900 mb-6">Update User</h2>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="space-y-4">
          <!-- Username Field (Disabled) -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Enter username" [disabled]="true">
          </mat-form-field>

          <!-- Email Field -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Enter email" type="email">
            <mat-error *ngIf="userForm.get('email')?.invalid">
              {{getErrorMessage('email')}}
            </mat-error>
          </mat-form-field>

          <!-- Role Field -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option *ngFor="let role of roles" [value]="role">
                {{role}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="userForm.get('role')?.invalid">
              {{getErrorMessage('role')}}
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <button mat-button 
                  type="button" 
                  (click)="onCancel()"
                  [disabled]="isLoading">
            Cancel
          </button>
          <button mat-flat-button 
                  color="primary" 
                  type="submit"
                  [disabled]="userForm.invalid || isLoading">
            {{isLoading ? 'Updating...' : 'Update'}}
          </button>
        </div>
      </form>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class UpdateUserDialogComponent {
  userForm: FormGroup;
  roles = ['USER', 'ADMIN'];
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: User,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: [{ value: data.username, disabled: true }],
      email: [data.email, [Validators.required, Validators.email]],
      role: [data.role, Validators.required]
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isLoading) {
      this.isLoading = true;
      const userData = {
        ...this.userForm.getRawValue()
      };

      this.userService.updateUser(userData).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          let errorMessage = 'Failed to update user';
          if (error.message === 'Invalid user data') {
            errorMessage = 'Invalid user data';
          } else if (error.message === 'Email already exists') {
            errorMessage = 'This email is already in use by another user';
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