import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService, CreateTaskDto, UpdateTaskDto } from '../services/tasks.service';
import { UsersService } from '../services/users.service';
import { Task, TaskStatus } from '../models/task.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  TaskStatus = TaskStatus;
  taskStatuses: { key: number; value: string }[] = [];
  
  // Create form
  newTask: CreateTaskDto = {
    Title: '',
    Description: '',
    AssignedUserId: undefined
  };
  
  // Edit state
  editingTaskId: number | null = null;
  editTask: UpdateTaskDto | null = null;

  constructor(
    private tasksService: TasksService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initializeTaskStatuses();
    this.loadTasks();
    this.loadUsers();
  }

  initializeTaskStatuses(): void {
    this.taskStatuses = Object.entries(TaskStatus)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => ({
        key: value as number,
        value: key
      }));
  }

  loadTasks(): void {
    console.log('Loading tasks...');
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks loaded:', tasks);
        console.log('First task keys:', tasks.length > 0 ? Object.keys(tasks[0]) : 'No tasks');
        console.log('First task:', tasks.length > 0 ? tasks[0] : 'No tasks');
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        console.error('Error details:', error.error);
      }
    });
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  createTask(): void {
    if (!this.newTask.Title.trim()) {
      alert('Title is required');
      return;
    }

    console.log('Creating task with data:', this.newTask);
    
    this.tasksService.createTask(this.newTask).subscribe({
      next: (createdTask) => {
        console.log('Task created successfully:', createdTask);
        this.newTask = { Title: '', Description: '', AssignedUserId: undefined };
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        console.error('Error details:', error.error);
        alert(`Failed to create task: ${error.message || 'Unknown error'}`);
      }
    });
  }

  startEdit(task: Task): void {
    this.editingTaskId = task.id;
    this.editTask = {
      Title: task.title,
      Description: task.description,
      AssignedUserId: task.assignedUserId,
      Status: task.status
    };
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editTask = null;
  }

  saveEdit(taskId: number): void {
    if (!this.editTask) return;

    if (!this.editTask.Title.trim()) {
      alert('Title is required');
      return;
    }

    this.tasksService.updateTask(taskId, this.editTask).subscribe({
      next: () => {
        this.editingTaskId = null;
        this.editTask = null;
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Error updating task. Status transitions must follow: ToDo → InProgress → Done');
      }
    });
  }

  deleteTask(taskId: number): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.tasksService.deleteTask(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (error) => console.error('Error deleting task:', error)
    });
  }

  isEditing(taskId: number): boolean {
    return this.editingTaskId === taskId;
  }

  getStatusName(status: TaskStatus): string {
    return TaskStatus[status];
  }

  getAvailableStatuses(currentStatus: TaskStatus): TaskStatus[] {
    switch (currentStatus) {
      case TaskStatus.ToDo:
        return [TaskStatus.ToDo, TaskStatus.InProgress];
      case TaskStatus.InProgress:
        return [TaskStatus.InProgress, TaskStatus.Done];
      case TaskStatus.Done:
        return [TaskStatus.Done];
      default:
        return [currentStatus];
    }
  }

  getUserName(userId?: number): string {
    if (!userId) return 'Unassigned';
    const user = this.users.find((u: User) => u.id === userId);
    return user ? user.name : 'Unknown';
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
