import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SidebarService } from './services/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    SharedModule,
    HeaderComponent,
    SideBarComponent
  ]
})
export class AppComponent implements OnInit {
  title = 'prime-fe-management';

  maxWidth: string = '1300px';
  currentTabMenu: boolean = true;
  isLoginPage = false;
  isSecure: boolean = false;
  isLoading: boolean = true;
  isExpandedSidebar = false;

  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
    });
  }

  ngOnInit() {
    this.sidebarService.isExpanded$.subscribe(
      isExpanded => this.isExpandedSidebar = isExpanded
    );
  }
}
