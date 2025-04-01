import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userEmail: string = 'nguyendanganhquan99@gmail.com';
  userName: string = 'Quan Nguyen';
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  openProfileDialog() {
    this.dialog.open(ProfileDialogComponent, {
      width: '500px',
      disableClose: true
    });
  }

  onSearch(event: any) {
    // Implement search functionality
    console.log('Searching:', event.target.value);
  }

  logout() {
    // Implement logout logic here
    console.log('Logging out...');
  }
}
