import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatMenuModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userEmail = 'nguyendanganh@gmail.com';
  userName = 'Quan Nguyen';

  onSearch(event: any) {
    // Implement search functionality
    console.log('Searching:', event.target.value);
  }

  logout() {
    // Implement logout logic here
    console.log('Logging out...');
  }
}
