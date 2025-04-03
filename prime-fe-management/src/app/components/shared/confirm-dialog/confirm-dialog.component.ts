import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-medium text-gray-900 mb-4">{{ data.title }}</h2>
      <p class="text-gray-600 mb-6">{{ data.message }}</p>
      <div class="flex justify-end gap-3">
        <button mat-button (click)="onClose(false)">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-flat-button 
                color="warn" 
                (click)="onClose(true)">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }
} 