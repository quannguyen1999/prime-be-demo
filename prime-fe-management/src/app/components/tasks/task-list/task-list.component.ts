import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TaskService, Task } from '../../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SidebarService } from '../../../services/sidebar.service';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AddTaskDialogComponent
  ]
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'projectName',
    'description',
    'status',
    'assignedTo',
    'createAt',
    'updatedAt',
    'actions'
  ];
  dataSource: MatTableDataSource<Task>;
  searchTerm: string = '';
  pageSize: number = 5;
  pageIndex: number = 0;
  totalElements: number = 0;
  isExpandedSidebar = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {
    this.dataSource = new MatTableDataSource<Task>();
  }

  ngOnInit(): void {
    this.loadTasks();
    this.sidebarService.isExpanded$.subscribe(
      isExpanded => this.isExpandedSidebar = isExpanded
    );
  }

  loadTasks(): void {
    this.taskService.getTasks(this.pageIndex, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalElements = response.total;
      },
      error: (error) => {
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTasks();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadTasks();
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Generate a random UUID for the new task
        const newTask: Task = {
          id: crypto.randomUUID(),
          ...result,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add the new task to the table
        const currentData = this.dataSource.data;
        this.dataSource.data = [newTask, ...currentData];
        
        // TODO: Add API call to create task
        this.loadTasks();
      }
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '600px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete task "${task.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe({
          next: (response) => {
            this.snackBar.open(response.message, 'Close', { duration: 3000 });
            this.loadTasks();
          },
          error: (error) => {
            let errorMessage = 'Failed to delete task';
            if (error.message === 'Task not found') {
              errorMessage = 'Task no longer exists';
            }
            this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
