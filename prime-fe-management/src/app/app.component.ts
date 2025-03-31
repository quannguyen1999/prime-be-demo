import { Component, OnInit } from '@angular/core';
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'prime-fe-management';

  maxWidth: string = '1300px';
  currentTabMenu: boolean = true;
  isLoginPage: boolean = false;
  isSecure: boolean = false;
  isLoading: boolean = true;
  isExpandedSidebar = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isExpanded$.subscribe(
      isExpanded => this.isExpandedSidebar = isExpanded
    );
  }
}
