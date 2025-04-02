import { Component, OnInit } from '@angular/core';
import { Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { curveLinear } from 'd3-shape';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ProjectService, ProjectStatistics, ProjectSummary, OverallStatistics, StatusBreakdown } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FindPipe } from '../../shared/pipes/find.pipe';

interface ProjectCard {
  id: string;
  title: string;
  type: string;
  progress: number;
  daysLeft: number;
  date: string;
  team: { id: string; avatar?: string; name: string }[];
}

interface ActivityLog {
  id: string;
  username: string;
  project: string;
  status: 'Created' | 'Updated' | 'Completed' | 'Deleted';
  timestamp: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    SharedModule,
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

  projects: ProjectCard[] = [
    {
      id: '1',
      title: 'Web Designing',
      type: 'Prototyping',
      progress: 60,
      daysLeft: 2,
      date: 'December 10, 2020',
      team: [
        { id: '1', name: 'John Doe', avatar: 'assets/avatars/1.jpg' },
        { id: '2', name: 'Jane Smith', avatar: 'assets/avatars/2.jpg' }
      ]
    },
    {
      id: '2',
      title: 'Testing',
      type: 'Prototyping',
      progress: 50,
      daysLeft: 2,
      date: 'December 10, 2020',
      team: [
        { id: '3', name: 'Alice Johnson', avatar: 'assets/avatars/3.jpg' },
        { id: '4', name: 'Bob Wilson', avatar: 'assets/avatars/4.jpg' }
      ]
    },
    {
      id: '3',
      title: 'Svg Animations',
      type: 'Prototyping',
      progress: 80,
      daysLeft: 2,
      date: 'December 10, 2020',
      team: [
        { id: '5', name: 'Charlie Brown', avatar: 'assets/avatars/5.jpg' },
        { id: '6', name: 'Diana Prince', avatar: 'assets/avatars/6.jpg' }
      ]
    },
    {
      id: '4',
      title: 'UI Development',
      type: 'Development',
      progress: 70,
      daysLeft: 3,
      date: 'December 10, 2020',
      team: [
        { id: '7', name: 'Eve Adams', avatar: 'assets/avatars/7.jpg' },
        { id: '8', name: 'Frank Miller', avatar: 'assets/avatars/8.jpg' }
      ]
    },
    {
      id: '5',
      title: 'Data Analysis',
      type: 'Analysis',
      progress: 40,
      daysLeft: 4,
      date: 'December 10, 2020',
      team: [
        { id: '9', name: 'Grace Lee', avatar: 'assets/avatars/9.jpg' },
        { id: '10', name: 'Henry Ford', avatar: 'assets/avatars/10.jpg' }
      ]
    },
    {
      id: '6',
      title: 'Web Designing',
      type: 'Design',
      progress: 90,
      daysLeft: 1,
      date: 'December 10, 2020',
      team: [
        { id: '11', name: 'Iris West', avatar: 'assets/avatars/11.jpg' },
        { id: '12', name: 'Jack Ryan', avatar: 'assets/avatars/12.jpg' }
      ]
    }
  ];

  viewType: 'grid' | 'list' = 'grid';

  activityLogs: ActivityLog[] = [
    {
      id: 'ACT001',
      username: 'John Doe',
      project: 'Web Designing',
      status: 'Created',
      timestamp: new Date('2024-03-31T10:30:00')
    },
    {
      id: 'ACT002',
      username: 'Jane Smith',
      project: 'Testing',
      status: 'Updated',
      timestamp: new Date('2024-03-31T09:45:00')
    },
    {
      id: 'ACT003',
      username: 'Alice Johnson',
      project: 'Svg Animations',
      status: 'Completed',
      timestamp: new Date('2024-03-31T09:15:00')
    },
    {
      id: 'ACT004',
      username: 'Bob Wilson',
      project: 'UI Development',
      status: 'Updated',
      timestamp: new Date('2024-03-31T08:30:00')
    },
    {
      id: 'ACT005',
      username: 'Charlie Brown',
      project: 'Data Analysis',
      status: 'Created',
      timestamp: new Date('2024-03-31T08:00:00')
    }
  ];

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadOverallStatistics();
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
    return Math.round(project.completionPercentage * 100);
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'Created': return 'bg-green-100 text-green-800';
      case 'Updated': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      case 'Deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/projects', projectId]);
  }
}
