import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { ProjectService, Project } from '../../../services/project.service';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { EditProjectDialogComponent } from '../edit-project-dialog/edit-project-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserRoleService } from '../../../services/user-role.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class ProjectListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'status', 'created', 'updated', 'owner', 'actions'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>([]);
  searchTerm: string = '';
  isExpandedSidebar = false;
  total = 0;
  pageSize = 5;
  pageIndex = 0;
  protected readonly Math = Math;
  isAdmin = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sidebarService: SidebarService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private userRoleService: UserRoleService
  ) {
    this.isAdmin = this.userRoleService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.sidebarService.isExpanded$.subscribe(
      isExpanded => this.isExpandedSidebar = isExpanded
    );
  }

  loadProjects(): void {
    this.projectService.getProjects(this.pageIndex, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.total = response.total;
          this.pageSize = response.size;
          this.pageIndex = response.page;
        },
        error: (error) => {
          console.error('Error loading projects:', error);
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProjects();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    this.pageIndex = 0;
    this.loadProjects();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadProjects();
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
      }
    });
  }

  viewProjectDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  editProject(project: Project): void {
    const dialogRef = this.dialog.open(EditProjectDialogComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
      }
    });
  }

  deleteProject(project: Project): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to delete project "${project.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project.id).subscribe({
          next: (response) => {
            this.snackBar.open(response.message, 'Close', { duration: 3000 });
            this.loadProjects();
          },
          error: (error) => {
            console.log(error)
            let errorMessage = 'Failed to delete project';
            if (error.message === 'Invalid project') {
              errorMessage = 'Project not found or already deleted';
            }
            this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
