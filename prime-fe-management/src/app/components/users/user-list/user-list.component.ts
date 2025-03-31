import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SidebarService } from '../../../services/sidebar.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  createdOn: Date;
  lastSeen?: Date;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: false
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'role', 'status', 'createdOn', 'lastSeen', 'actions'];
  dataSource: MatTableDataSource<User>;
  searchTerm: string = '';
  isExpandedSidebar = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private sidebarService: SidebarService
  ) {
    // Sample data - replace with actual API call
    const users: User[] = [
      {
        id: 'c3e1a5a0-5398-4697-bbe6-00c90da7d8b5',
        username: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active',
        createdOn: new Date('2023-01-01'),
        lastSeen: new Date('2024-03-15')
      },
      {
        id: 'b4d2b6b1-6499-7798-ccf7-11d91eb8c9c6',
        username: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        status: 'Active',
        createdOn: new Date('2023-02-15'),
        lastSeen: new Date('2024-03-14')
      },
      {
        id: 'a5e3c7c2-7500-8899-ddg8-22e92fc9d0d7',
        username: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'User',
        status: 'Inactive',
        createdOn: new Date('2023-03-30'),
        lastSeen: new Date('2024-02-28')
      }
    ];
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.sidebarService.isExpanded$.subscribe(
      isExpanded => this.isExpandedSidebar = isExpanded
    );

    // Add custom filter predicate for search
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.username.toLowerCase().includes(searchStr) ||
             data.email.toLowerCase().includes(searchStr) ||
             data.role.toLowerCase().includes(searchStr) ||
             data.status.toLowerCase().includes(searchStr);
    };
  }

  onSearch(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Generate a random UUID for the new user
        const newUser: User = {
          id: crypto.randomUUID(),
          ...result,
          lastSeen: new Date()
        };
        
        // Add the new user to the table
        const currentData = this.dataSource.data;
        this.dataSource.data = [newUser, ...currentData];
        
        // TODO: Add API call to create user
        console.log('New user added:', newUser);
      }
    });
  }

  editUser(user: User): void {
    // TODO: Implement edit logic
    console.log('Editing user:', user);
  }

  deleteUser(user: User): void {
    // TODO: Implement delete logic
    console.log('Deleting user:', user);
  }
}
