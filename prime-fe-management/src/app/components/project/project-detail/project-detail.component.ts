import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { Task } from '../../../models/task.model';
import { FilterByStatusPipe } from '../../../shared/pipes/filter-by-status.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-detail.component.html',
  standalone: true,
  imports: [SharedModule, FilterByStatusPipe, DragDropModule]
})
export class ProjectDetailsComponent implements OnInit {
  projectId: string = '';
  
  // Separate arrays for each status
  backlogTasks: Task[] = [];
  doingTasks: Task[] = [];
  onHoldTasks: Task[] = [];
  doneTasks: Task[] = [];
  archivedTasks: Task[] = [];
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('Project ID is required');
      throw new Error('Project ID is required');
    }
    this.projectId = id;
    this.loadTasks();
  }

  loadTasks() {
    // Mock data - replace with actual API call
    const allTasks = [
      {
        id: '1',
        title: 'Content on new use case',
        status: 'backlog' as const,
        assignee: 'Britta Perry',
        priority: 'medium' as const
      },
      {
        id: '2',
        title: 'Review content',
        status: 'doing' as const,
        assignee: 'Britta Perry',
        dueDate: new Date('2024-04-28'),
        priority: 'high' as const
      },
      {
        id: '3',
        title: 'New marketing campaign',
        status: 'on_hold' as const,
        assignee: 'Troy Barnes',
        priority: 'medium' as const
      },
      {
        id: '4',
        title: 'Follow up with Finance team',
        status: 'done' as const,
        assignee: 'Britta Perry',
        priority: 'high' as const
      },
      {
        id: '5',
        title: 'Contact external supplier',
        status: 'archived' as const,
        assignee: 'Britta Perry',
        priority: 'low' as const
      },
      {
        id: '6',
        title: 'Write blog post',
        status: 'archived' as const,
        assignee: 'Jeff Winger',
        priority: 'low' as const
      }
    ] as const;

    // Distribute tasks to their respective arrays
    this.backlogTasks = allTasks.filter(task => task.status === 'backlog');
    this.doingTasks = allTasks.filter(task => task.status === 'doing');
    this.onHoldTasks = allTasks.filter(task => task.status === 'on_hold');
    this.doneTasks = allTasks.filter(task => task.status === 'done');
    this.archivedTasks = allTasks.filter(task => task.status === 'archived');
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
    switch (status) {
      case 'backlog': return this.backlogTasks.length;
      case 'doing': return this.doingTasks.length;
      case 'on_hold': return this.onHoldTasks.length;
      case 'done': return this.doneTasks.length;
      case 'archived': return this.archivedTasks.length;
      default: return 0;
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Get the task that's being moved
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as Task['status'];
      
      // Update the task's status
      task.status = newStatus;

      // Remove from previous array
      event.previousContainer.data.splice(event.previousIndex, 1);

      // Add to new array
      event.container.data.splice(event.currentIndex, 0, task);

      // Update the arrays based on the status
      this.backlogTasks = [...this.backlogTasks];
      this.doingTasks = [...this.doingTasks];
      this.onHoldTasks = [...this.onHoldTasks];
      this.doneTasks = [...this.doneTasks];
      this.archivedTasks = [...this.archivedTasks];
    }
  }
} 