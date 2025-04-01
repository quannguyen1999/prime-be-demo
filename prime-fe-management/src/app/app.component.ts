import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="!isLoginPage(); else loginTemplate">
      <app-header></app-header>
      <div class="flex min-h-screen bg-gray-50">
        <app-side-bar></app-side-bar>
        <main [class]="isExpanded ? 'ml-[230px]' : 'ml-[45px]'" 
              class="flex-1 p-8 mt-16 transition-all duration-300">
          <router-outlet></router-outlet>
        </main>
      </div>
    </ng-container>
    <ng-template #loginTemplate>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SideBarComponent]
})
export class AppComponent {
  isExpanded = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.isExpanded$.subscribe(
      expanded => this.isExpanded = expanded
    );
  }

  isLoginPage(): boolean {
    return window.location.pathname === '/login' || window.location.pathname === '/register';
  }
}
