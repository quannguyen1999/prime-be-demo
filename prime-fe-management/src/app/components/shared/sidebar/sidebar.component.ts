import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [SharedModule],
  standalone: true,
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onLogout(): void {
    this.authService.logout();
  }
} 