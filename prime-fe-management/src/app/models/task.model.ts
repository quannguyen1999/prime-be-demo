export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'doing' | 'on_hold' | 'done' | 'archived';
  assignee: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
} 