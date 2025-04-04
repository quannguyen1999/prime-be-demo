import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { listMenus } from 'src/app/constants/constant-value-model';
import { Menu } from 'src/app/models/menu.model';
import { SidebarService } from '../../services/sidebar.service';
import { EventEmitter, Input, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserRoleService } from '../../services/user-role.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  animations: [
    trigger('sidebarAnimation', [
      state('expanded', style({
        width: '230px'
      })),
      state('collapsed', style({
        width: '55px'
      })),
      transition('expanded <=> collapsed', [
        animate('0.3s ease-in-out')
      ])
    ]),
    trigger('contentAnimation', [
      state('expanded', style({
        opacity: 1,
        display: 'block'
      })),
      state('collapsed', style({
        opacity: 0,
        display: 'none'
      })),
      transition('expanded <=> collapsed', [
        animate('0.2s ease-in-out')
      ])
    ])
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class SideBarComponent implements OnInit {
  @Output() currentValue = new EventEmitter<Menu>();
  @Input() currentTabMenu!: boolean;
  
  isExpandedSidebar = false;
  listMenus: Array<Menu> = [];

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private userRoleService: UserRoleService
  ) {}

  ngOnInit(): void {
    console.log('SideBarComponent initializing...');
    // Ensure roles are loaded
    this.userRoleService.reloadRoles();
    this.filterMenusByRole();
  }

  private filterMenusByRole(): void {
    console.log('Filtering menus by role...');
    console.log('All available menus:', listMenus);
    
    this.listMenus = listMenus.filter(menu => {
      const hasAccess = this.userRoleService.hasAnyRole(menu.roles);
      console.log(`Menu "${menu.name}" (roles: ${menu.roles.join(', ')}): ${hasAccess ? 'visible' : 'hidden'}`);
      return hasAccess;
    });
    
    console.log('Filtered menus:', this.listMenus);
  }

  onHoverMenuEnter() {
    this.isExpandedSidebar = true;
    this.sidebarService.setExpanded(true);
  }

  onHoverMenuLeave() {
    this.isExpandedSidebar = false;
    this.sidebarService.setExpanded(false);
  }

  onClickMenu(menuId: number) {
    this.listMenus.forEach(value => value.isSelected = false);
    const menu = this.listMenus.find(t => t.id === menuId);
    if (menu) {
      menu.isSelected = true;
      this.router.navigate([menu.url]);
      this.currentValue.emit(menu);
    }
  }
}
