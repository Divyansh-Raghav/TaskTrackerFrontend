export enum TaskStatus {
  ToDo = 0,
  InProgress = 1,
  Done = 2
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedUserId?: number;
  createdAt: string;
}
