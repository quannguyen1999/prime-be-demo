import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userEmail = 'nguyendanganh@gmail.com';
  userName = 'Quan Nguyen';

  onSearch(event: any) {
    // Implement search functionality
    console.log('Searching:', event.target.value);
  }
}
