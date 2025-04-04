import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService, Task } from '../../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';
import { FilterByStatusPipe } from '../../../shared/pipes/filter-by-status.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../../tasks/add-task-dialog/add-task-dialog.component';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';

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
export class ProjectDetailComponent implements OnInit, OnDestroy {
  projectId: string = '';
  taskGroups: TaskGroup[] = [
    { status: 'BACK_LOG', displayName: 'Backlog', tasks: [], count: 0 },
    { status: 'DOING', displayName: 'Doing', tasks: [], count: 0 },
    { status: 'ON_HOLD', displayName: 'On Hold', tasks: [], count: 0 },
    { status: 'DONE', displayName: 'Done', tasks: [], count: 0 },
    { status: 'ARCHIVED', displayName: 'Archived', tasks: [], count: 0 }
  ];

  private wsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProjectTasks();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  private setupWebSocket(): void {
    this.webSocketService.connectToProject(this.projectId);
    this.wsSubscription = this.webSocketService.taskEvents$.subscribe(event => {
      switch (event.type) {
        case 'create':
          this.handleTaskCreation(event.data as Task);
          break;
        case 'update':
          this.handleTaskUpdate(event.data as Task);
          break;
        case 'delete':
          this.handleTaskDeletion(event.data as string);
          break;
      }
    });
  }

  private handleTaskCreation(task: Task): void {
    const group = this.taskGroups.find(g => g.status === task.status);
    if (group) {
      group.tasks.push(task);
      group.count++;
    }
  }

  private handleTaskUpdate(updatedTask: Task): void {
    console.log('Handling task update:', updatedTask);
    
    // Find the task in its current group
    let taskFound = false;
    this.taskGroups.forEach(group => {
      const index = group.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        console.log(`Found task in group ${group.status} at index ${index}`);
        taskFound = true;
        
        // Only remove if the status has changed
        if (group.status !== updatedTask.status) {
          console.log(`Moving task from ${group.status} to ${updatedTask.status}`);
          group.tasks.splice(index, 1);
          group.count--;
          
          // Add task to new group
          const newGroup = this.taskGroups.find(g => g.status === updatedTask.status);
          if (newGroup) {
            newGroup.tasks.push(updatedTask);
            newGroup.count++;
          }
        } else {
          // Just update the task in place
          console.log(`Updating task in place in ${group.status}`);
          group.tasks[index] = updatedTask;
        }
      }
    });

    // If task wasn't found in any group (new task), add it to the appropriate group
    if (!taskFound) {
      console.log('Task not found in any group, adding to new group');
      const newGroup = this.taskGroups.find(g => g.status === updatedTask.status);
      if (newGroup) {
        newGroup.tasks.push(updatedTask);
        newGroup.count++;
      }
    }
  }

  private handleTaskDeletion(taskId: string): void {
    this.taskGroups.forEach(group => {
      const index = group.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        group.tasks.splice(index, 1);
        group.count--;
      }
    });
  }

  loadProjectTasks(): void {
    this.taskService.getProjectTasks(this.projectId).subscribe({
      next: (tasks) => {
        // Reset all task groups
        this.taskGroups.forEach(group => {
          group.tasks = tasks.filter(task => task.status === group.status);
          group.count = group.tasks.length;
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    console.log('Drop event:', {
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
      task: event.previousContainer.data[event.previousIndex]
    });

    if (event.previousContainer === event.container) {
      // Handle reordering within the same container
      console.log('Reordering within same container');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Handle moving between containers
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.taskGroups.find(g => g.tasks === event.container.data)?.status;
      
      console.log('Moving task between containers:', {
        taskId: task.id,
        taskTitle: task.title,
        fromStatus: task.status,
        toStatus: newStatus
      });
      
      if (newStatus) {
        this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
          next: (updatedTask: Task) => {
            console.log('Task status updated successfully:', updatedTask);
            
            // Only move the specific task that was dragged
            const sourceIndex = event.previousContainer.data.findIndex(t => t.id === task.id);
            if (sourceIndex !== -1) {
              const [movedTask] = event.previousContainer.data.splice(sourceIndex, 1);
              event.container.data.splice(event.currentIndex, 0, movedTask);
              
              // Update counts
              const prevGroup = this.taskGroups.find(g => g.tasks === event.previousContainer.data);
              const newGroup = this.taskGroups.find(g => g.tasks === event.container.data);
              if (prevGroup) {
                prevGroup.count = prevGroup.tasks.length;
                console.log(`Updated previous group count: ${prevGroup.status} = ${prevGroup.count}`);
              }
              if (newGroup) {
                newGroup.count = newGroup.tasks.length;
                console.log(`Updated new group count: ${newGroup.status} = ${newGroup.count}`);
              }
            } else {
              console.error('Task not found in source container:', task.id);
              this.loadProjectTasks(); // Reload if we can't find the task
            }
          },
          error: (error: any) => {
            console.error('Failed to update task status:', error);
            this.snackBar.open('Failed to update task status', 'Close', { duration: 3000 });
            this.loadProjectTasks(); // Reload tasks to reset the UI
          }
        });
      }
    }
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: {
        preselectedProject: {
          id: this.projectId,
          name: this.taskGroups[0]?.tasks[0]?.projectName
        },
        disableProject: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjectTasks();
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
    
    // For other statuses, connect to all except itself
    return this.taskGroups
      .map(group => group.status)
      .filter(s => s !== status);
  }
} 