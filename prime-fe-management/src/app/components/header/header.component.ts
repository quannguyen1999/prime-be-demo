import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  aud: string;
  nbf: number;
  iss: string;
  id: string;
  exp: number;
  iat: number;
  user: string;
  authorities: string[];
}

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
export class HeaderComponent implements OnInit {
  userName: string = '';
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        // Use the user field from the token
        this.userName = decodedToken.user || decodedToken.sub || 'User';
      } catch (error) {
        console.error('Error decoding token:', error);
        this.userName = 'User';
      }
    } else {
      this.userName = 'User';
    }
  }

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
    this.authService.logout();
  }
}
