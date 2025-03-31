import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SidebarService } from '../../../services/sidebar.service';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  username: string;
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'updatedAt', 'username', 'actions'];
  dataSource: MatTableDataSource<Project>;
  searchTerm: string = '';
  isExpandedSidebar = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private sidebarService: SidebarService
  ) {
    // Sample data - replace with actual API call
    const projects: Project[] = [
      {
        id: 'p1e1a5a0-5398-4697-bbe6-00c90da7d8b5',
        name: 'E-commerce Platform',
        description: 'Online shopping platform with modern features',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-03-15'),
        userId: 'c3e1a5a0-5398-4697-bbe6-00c90da7d8b5',
        username: 'John Doe'
      },
      {
        id: 'p2d2b6b1-6499-7798-ccf7-11d91eb8c9c6',
        name: 'CRM System',
        description: 'Customer relationship management system',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-03-14'),
        userId: 'b4d2b6b1-6499-7798-ccf7-11d91eb8c9c6',
        username: 'Jane Smith'
      }
    ];
    this.dataSource = new MatTableDataSource(projects);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.sidebarService.isExpanded$.subscribe(
      isExpanded => this.isExpandedSidebar = isExpanded
    );

    // Add custom filter predicate for search
    this.dataSource.filterPredicate = (data: Project, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchStr) ||
             data.description.toLowerCase().includes(searchStr) ||
             data.username.toLowerCase().includes(searchStr);
    };
  }

  onSearch(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Generate a random UUID for the new project
        const newProject: Project = {
          id: crypto.randomUUID(),
          name: result.name,
          description: result.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'c3e1a5a0-5398-4697-bbe6-00c90da7d8b5', // This should come from auth service
          username: 'John Doe' // This should come from auth service
        };
        
        // Add the new project to the table
        const currentData = this.dataSource.data;
        this.dataSource.data = [newProject, ...currentData];
        
        // TODO: Add API call to create project
        console.log('New project added:', newProject);
      }
    });
  }

  editProject(project: Project): void {
    // TODO: Implement edit logic
    console.log('Editing project:', project);
  }

  deleteProject(project: Project): void {
    // TODO: Implement delete logic
    console.log('Deleting project:', project);
  }
}
