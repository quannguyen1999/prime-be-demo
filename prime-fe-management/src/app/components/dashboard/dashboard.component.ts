import { Component, OnInit } from '@angular/core';
import { Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { curveLinear } from 'd3-shape';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ProjectService, ProjectStatistics, ProjectSummary, OverallStatistics, ActivityLog, ActivityLogResponse } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FindPipe } from '../../shared/pipes/find.pipe';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';

interface ProjectCard {
  id: string;
  title: string;
  type: string;
  progress: number;
  daysLeft: number;
  date: string;
  team: { id: string; avatar?: string; name: string }[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatMenuModule,
    MatPaginatorModule,
    NgxChartsModule,
    FindPipe
  ]
})
export class DashboardComponent implements OnInit {
  statistics: ProjectStatistics | null = null;
  overallStats: OverallStatistics | null = null;
  inProgressCount = 0;
  upcomingCount = 0;
  totalProjects = 0;
  currentDate = new Date();
  
  projectStats = {
    inProgress: 45,
    upcoming: 24,
    total: 62
  };

  view: [number, number] = [700, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  timeline = true;

  legendPosition: LegendPosition = LegendPosition.Below;

  progressData = [
    {
      name: 'Backlog',
      series: [
        { name: 'Jan', value: 15 },
        { name: 'Feb', value: 20 },
        { name: 'Mar', value: 25 },
        { name: 'Apr', value: 30 },
        { name: 'May', value: 35 },
        { name: 'Jun', value: 40 }
      ]
    },
    {
      name: 'Doing',
      series: [
        { name: 'Jan', value: 10 },
        { name: 'Feb', value: 15 },
        { name: 'Mar', value: 20 },
        { name: 'Apr', value: 25 },
        { name: 'May', value: 30 },
        { name: 'Jun', value: 35 }
      ]
    },
    {
      name: 'On Hold',
      series: [
        { name: 'Jan', value: 5 },
        { name: 'Feb', value: 8 },
        { name: 'Mar', value: 12 },
        { name: 'Apr', value: 15 },
        { name: 'May', value: 18 },
        { name: 'Jun', value: 20 }
      ]
    },
    {
      name: 'Done',
      series: [
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 25 },
        { name: 'Mar', value: 30 },
        { name: 'Apr', value: 35 },
        { name: 'May', value: 40 },
        { name: 'Jun', value: 45 }
      ]
    },
    {
      name: 'Archived',
      series: [
        { name: 'Jan', value: 8 },
        { name: 'Feb', value: 12 },
        { name: 'Mar', value: 16 },
        { name: 'Apr', value: 20 },
        { name: 'May', value: 24 },
        { name: 'Jun', value: 28 }
      ]
    }
  ];

  projectTypeData: any[] = [];

  colorScheme: Color = {
    name: 'taskStatus',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9CA3AF', '#3B82F6', '#FBBF24', '#10B981', '#EF4444']  // gray, blue, yellow, green, red
  };

  curve = curveLinear;

  viewType: 'grid' | 'list' = 'grid';

  activityLogs: ActivityLog[] = [];
  totalActivityLogs: number = 0;
  activityLogsPageSize: number = 5;
  activityLogsPageIndex: number = 0;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadOverallStatistics();
    this.loadActivityLogs();
  }

  loadStatistics(): void {
    this.projectService.getProjectStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.calculateCounts();
      },
      error: (error) => {
        this.snackBar.open('Failed to load project statistics', 'Close', { duration: 3000 });
      }
    });
  }

  loadOverallStatistics(): void {
    this.projectService.getOverallStatistics().subscribe({
      next: (data) => {
        this.overallStats = data;
        this.updateTaskStatusChart();
      },
      error: (error) => {
        this.snackBar.open('Failed to load overall statistics', 'Close', { duration: 3000 });
      }
    });
  }

  loadActivityLogs(): void {
    this.projectService.getActivityLogs(this.activityLogsPageIndex, this.activityLogsPageSize).subscribe({
      next: (response) => {
        this.activityLogs = response.data;
        this.totalActivityLogs = response.total;
      },
      error: (error) => {
        this.snackBar.open('Failed to load activity logs', 'Close', { duration: 3000 });
      }
    });
  }

  private calculateCounts(): void {
    if (!this.statistics) return;

    // Count in progress projects (projects with tasks in DOING status)
    this.inProgressCount = this.statistics.projectSummaries.filter(
      project => project.members.length > 0
    ).length;

    // Count upcoming projects (projects with no tasks yet)
    this.upcomingCount = this.statistics.projectSummaries.filter(
      project => project.members.length === 0
    ).length;

    // Total projects
    this.totalProjects = this.statistics.projectSummaries.length;
  }

  private updateTaskStatusChart(): void {
    if (!this.overallStats?.projectStats?.[0]?.statusBreakdown) return;

    const breakdown = this.overallStats.projectStats[0].statusBreakdown;
    this.projectTypeData = [
      {
        name: 'Backlog',
        value: breakdown.backlogTasks,
        percentage: breakdown.backlogPercentage
      },
      {
        name: 'Doing',
        value: breakdown.doingTasks,
        percentage: breakdown.doingPercentage
      },
      {
        name: 'On Hold',
        value: breakdown.onHoldTasks,
        percentage: breakdown.onHoldPercentage
      },
      {
        name: 'Done',
        value: breakdown.doneTasks,
        percentage: breakdown.donePercentage
      },
      {
        name: 'Archived',
        value: breakdown.archivedTasks,
        percentage: breakdown.archivedPercentage
      }
    ];
  }

  formatValue(value: number): string {
    return `${value} Tasks`;
  }

  getProjectProgress(project: ProjectSummary): number {
  
    return Math.round(project.completionPercentage);
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-gray-500';
  }

  toggleView(type: 'grid' | 'list'): void {
    this.viewType = type;
  }

  getProgressBarColor(progress: number): string {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  onSelect(event: any): void {
    console.log('Item clicked', event);
  }

  getStatusColor(action: string): string {
    switch (action) {
      case 'TASK_CREATED': return 'bg-green-100 text-green-800';
      case 'TASK_UPDATED': return 'bg-blue-100 text-blue-800';
      case 'TASK_DELETED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatAction(action: string): string {
    switch (action) {
      case 'TASK_CREATED': return 'Created';
      case 'TASK_UPDATED': return 'Updated';
      case 'TASK_DELETED': return 'Deleted';
      default: return action;
    }
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/projects', projectId]);
  }

  onActivityLogPageChange(event: PageEvent): void {
    this.activityLogsPageIndex = event.pageIndex;
    this.activityLogsPageSize = event.pageSize;
    this.loadActivityLogs();
  }
}
