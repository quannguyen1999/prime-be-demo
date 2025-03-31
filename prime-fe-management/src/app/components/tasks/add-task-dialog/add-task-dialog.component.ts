import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styles: [`
    :host {
      display: block;
    }
    .form-field input, .form-field textarea, .form-field mat-select {
      border-color: #e2e8f0;
    }
    .form-field input::placeholder, .form-field textarea::placeholder {
      color: #64748b;
    }
  `]
})
export class AddTaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  projects = [
    { id: 'p1e1a5a0-5398-4697-bbe6-00c90da7d8b5', name: 'E-commerce Platform' },
    { id: 'p2d2b6b1-6499-7798-ccf7-11d91eb8c9c6', name: 'CRM System' }
  ];
  users = [
    { id: 'c3e1a5a0-5398-4697-bbe6-00c90da7d8b5', name: 'John Doe' },
    { id: 'b4d2b6b1-6499-7798-ccf7-11d91eb8c9c6', name: 'Jane Smith' }
  ];
  statuses = ['Todo', 'In Progress', 'Done'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      projectName: [''],
      status: ['Todo', [Validators.required]],
      assignedToId: ['', [Validators.required]],
      assignedToName: ['']
    });

    // Update project name when project id changes
    this.taskForm.get('projectId')?.valueChanges.subscribe(projectId => {
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        this.taskForm.patchValue({ projectName: project.name }, { emitEvent: false });
      }
    });

    // Update assigned user name when user id changes
    this.taskForm.get('assignedToId')?.valueChanges.subscribe(userId => {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        this.taskForm.patchValue({ assignedToName: user.name }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
} 