import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  aud: string;
  nbf: number;
  iss: string;
  id: string;
  exp: number;
  iat: number;
  user: string;
  authorities: string[];
}

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold">Profile Information</h2>
        <button mat-icon-button (click)="dialogRef.close()" class="bg-gray-100 hover:bg-gray-200">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <form [formGroup]="profileForm" class="space-y-6">
        <div class="flex justify-center mb-8">
          <div class="w-32 h-32 rounded-full bg-[#4355B9] flex items-center justify-center">
            <span class="text-4xl font-medium text-white uppercase">{{userName[0]}}</span>
          </div>
        </div>

        <mat-form-field appearance="outline" class="w-full">
         
          <input matInput formControlName="username" placeholder="Enter username">
          <mat-error *ngIf="profileForm.get('username')?.errors?.['required']">
            Username is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
       
          <input matInput [value]="userRole" readonly>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
       
          <input matInput [value]="userStatus" readonly>
        </mat-form-field>

        <div class="flex justify-end space-x-3 pt-4">
          <button mat-button 
                  class="px-6"
                  (click)="dialogRef.close()">
            Cancel
          </button>
          <button mat-flat-button 
                  color="primary"
                  class="px-6"
                  [disabled]="!profileForm.valid || !profileForm.dirty"
                  (click)="onSubmit()">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `]
})
export class ProfileDialogComponent implements OnInit {
  profileForm: FormGroup;
  userName: string = '';
  userRole: string = '';
  userStatus = 'ACTIVE';

  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        this.userName = decodedToken.user || decodedToken.sub || 'User';
        this.userRole = decodedToken.authorities?.[0] || 'USER';
        
        // Initialize form with current username
        this.profileForm.patchValue({
          username: this.userName
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      this.dialogRef.close(this.profileForm.value);
    }
  }
} 