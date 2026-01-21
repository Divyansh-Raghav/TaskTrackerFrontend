import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: 'tasks', component: TasksComponent },
  { path: 'users', component: UsersComponent },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' }
];
