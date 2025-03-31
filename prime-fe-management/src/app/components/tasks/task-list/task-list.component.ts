import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SidebarService } from '../../../services/sidebar.service';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';

interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done';
  assignedToId: string;
  assignedToName: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'projectName', 'description', 'status', 'assignedToName', 'actions'];
  dataSource: MatTableDataSource<Task>;
  searchTerm: string = '';
  isExpandedSidebar = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private sidebarService: SidebarService
  ) {
    // Sample data - replace with actual API call
    const tasks: Task[] = [
      {
        id: 't1e1a5a0-5398-4697-bbe6-00c90da7d8b5',
        projectId: 'p1e1a5a0-5398-4697-bbe6-00c90da7d8b5',
        projectName: 'E-commerce Platform',
        title: 'Implement User Authentication',
        description: 'Add JWT-based authentication system',
        status: 'In Progress',
        assignedToId: 'c3e1a5a0-5398-4697-bbe6-00c90da7d8b5',
        assignedToName: 'John Doe',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-15')
      },
      {
        id: 't2d2b6b1-6499-7798-ccf7-11d91eb8c9c6',
        projectId: 'p2d2b6b1-6499-7798-ccf7-11d91eb8c9c6',
        projectName: 'CRM System',
        title: 'Design Database Schema',
        description: 'Create initial database design for customer data',
        status: 'Todo',
        assignedToId: 'b4d2b6b1-6499-7798-ccf7-11d91eb8c9c6',
        assignedToName: 'Jane Smith',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10')
      }
    ];
    this.dataSource = new MatTableDataSource(tasks);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.sidebarService.isExpanded$.subscribe(
      isExpanded => this.isExpandedSidebar = isExpanded
    );

    // Add custom filter predicate for search
    this.dataSource.filterPredicate = (data: Task, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.title.toLowerCase().includes(searchStr) ||
             data.description.toLowerCase().includes(searchStr) ||
             data.projectName.toLowerCase().includes(searchStr) ||
             data.assignedToName.toLowerCase().includes(searchStr) ||
             data.status.toLowerCase().includes(searchStr);
    };
  }

  onSearch(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
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
        console.log('New task added:', newTask);
      }
    });
  }

  editTask(task: Task): void {
    // TODO: Implement edit logic
    console.log('Editing task:', task);
  }

  deleteTask(task: Task): void {
    // TODO: Implement delete logic
    console.log('Deleting task:', task);
  }
}
