import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { curveLinear } from 'd3-shape';

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
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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

  progressData = [
    {
      name: 'Completed',
      series: [
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 35 },
        { name: 'Mar', value: 45 },
        { name: 'Apr', value: 40 },
        { name: 'May', value: 55 },
        { name: 'Jun', value: 50 }
      ]
    },
    {
      name: 'In Progress',
      series: [
        { name: 'Jan', value: 15 },
        { name: 'Feb', value: 25 },
        { name: 'Mar', value: 30 },
        { name: 'Apr', value: 35 },
        { name: 'May', value: 40 },
        { name: 'Jun', value: 45 }
      ]
    }
  ];

  projectTypeData = [
    { name: 'Development', value: 25 },
    { name: 'Design', value: 15 },
    { name: 'Testing', value: 10 },
    { name: 'Research', value: 12 }
  ];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
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

  constructor() {}

  ngOnInit(): void {}

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
}
