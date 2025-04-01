import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Profile Information</h2>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <form [formGroup]="profileForm" class="space-y-4">
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
            <span class="text-3xl text-white">{{userName[0]}}</span>
          </div>
        </div>

        <div>
          <mat-form-field appearance="outline" class="w-full">
           
            <input matInput formControlName="username" placeholder="Enter username">
            <mat-error *ngIf="profileForm.get('username')?.errors?.['required']">
              Username is required
            </mat-error>
          </mat-form-field>
        </div>

        <div>
          <mat-form-field appearance="outline" class="w-full">
           
            <input matInput formControlName="email" type="email" placeholder="Enter email">
            <mat-error *ngIf="profileForm.get('email')?.errors?.['required']">
              Email is required
            </mat-error>
            <mat-error *ngIf="profileForm.get('email')?.errors?.['email']">
              Please enter a valid email
            </mat-error>
          </mat-form-field>
        </div>

        <div>
          <mat-form-field appearance="outline" class="w-full">
           
            <input matInput [value]="userRole" readonly>
          </mat-form-field>
        </div>

        <div>
          <mat-form-field appearance="outline" class="w-full">
          
            <input matInput [value]="userStatus" readonly>
          </mat-form-field>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button mat-button (click)="dialogRef.close()">Cancel</button>
          <button mat-raised-button color="primary" 
                  [disabled]="!profileForm.valid || !profileForm.dirty"
                  (click)="onSubmit()">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProfileDialogComponent {
  profileForm: FormGroup;
  userName = 'Quan Nguyen';
  userRole = 'USER';
  userStatus = 'ACTIVE';

  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['Quan Nguyen', [Validators.required]],
      email: ['nguyendanganhquan99@gmail.com', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Handle form submission
      console.log(this.profileForm.value);
      this.dialogRef.close(this.profileForm.value);
    }
  }
} 