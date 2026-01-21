import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

export interface CreateTaskDto {
  Title: string;
  Description?: string;
  AssignedUserId?: number;
}

export interface UpdateTaskDto {
  Title: string;
  Description?: string;
  AssignedUserId?: number;
  Status: TaskStatus;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly baseUrl = '/api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    console.log('TasksService: Fetching tasks from', this.baseUrl);
    return this.http.get<Task[]>(this.baseUrl);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(dto: CreateTaskDto): Observable<Task> {
    console.log('TasksService: Sending POST request with data:', dto);
    return this.http.post<Task>(this.baseUrl, dto);
  }

  updateTask(id: number, dto: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, dto);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
