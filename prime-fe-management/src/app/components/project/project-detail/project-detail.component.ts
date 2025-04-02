import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService, Task } from '../../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';
import { FilterByStatusPipe } from '../../../shared/pipes/filter-by-status.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../../tasks/add-task-dialog/add-task-dialog.component';

interface TaskGroup {
  status: string;
  displayName: string;
  tasks: Task[];
  count: number;
}

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [SharedModule, FilterByStatusPipe, DragDropModule]
})
export class ProjectDetailComponent implements OnInit {
  projectId: string = '';
  taskGroups: TaskGroup[] = [];
  
  readonly STATUS_GROUPS: TaskGroup[] = [
    { status: 'BACK_LOG', displayName: 'Backlog', tasks: [], count: 0 },
    { status: 'DOING', displayName: 'Doing', tasks: [], count: 0 },
    { status: 'ON_HOLD', displayName: 'On Hold', tasks: [], count: 0 },
    { status: 'DONE', displayName: 'Done', tasks: [], count: 0 },
    { status: 'ARCHIVED', displayName: 'Archived', tasks: [], count: 0 }
  ];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params['id'];
    this.loadProjectTasks();
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: {
        preselectedProject: {
          id: this.projectId,
          name: this.taskGroups[0]?.tasks[0]?.projectName // Get project name from any task
        },
        disableProject: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjectTasks(); // Refresh tasks after adding
      }
    });
  }

  loadProjectTasks(): void {
    if (!this.projectId) return;
    
    this.taskService.getProjectTasks(this.projectId).subscribe({
      next: (tasks) => {
        // Reset task groups
        this.taskGroups = JSON.parse(JSON.stringify(this.STATUS_GROUPS));
        
        // Group tasks by status
        tasks.forEach(task => {
          const group = this.taskGroups.find(g => g.status === task.status);
          if (group) {
            group.tasks.push(task);
            group.count = group.tasks.length;
          }
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
      }
    });
  }

  getStatusColor(status: 'backlog' | 'doing' | 'on_hold' | 'done' | 'archived'): string {
    const colors: Record<string, string> = {
      backlog: 'bg-gray-100 text-gray-800',
      doing: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      done: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['backlog'];
  }

  getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors['low'];
  }

  getTaskCount(status: Task['status']): number {
    const group = this.taskGroups.find(g => g.status === status);
    return group ? group.count : 0;
  }

  getConnectedLists(status: string): string[] {
    // If current status is ARCHIVED, return empty array (can't drag out)
    if (status === 'ARCHIVED') {
      return [];
    }
    
    // For other statuses, connect to all except ARCHIVED and itself
    return this.STATUS_GROUPS
      .map(group => group.status)
      .filter(s => s !== status && s !== 'ARCHIVED');
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status
      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id as Task['status'];
      
      this.taskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        assignedTo: task.userName,
        status: newStatus
      }).subscribe({
        next: (updatedTask) => {
          // Update counts
          this.taskGroups.forEach(group => {
            group.count = group.tasks.length;
          });
        },
        error: (error) => {
          // Revert the move if update fails
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          this.snackBar.open('Failed to update task status', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 