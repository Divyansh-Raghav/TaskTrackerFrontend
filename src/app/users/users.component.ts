import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, CreateUserDto } from '../services/users.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  
  newUser: CreateUserDto = {
    Name: ''
  };

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  createUser(): void {
    if (!this.newUser.Name.trim()) {
      alert('Name is required');
      return;
    }

    this.usersService.createUser(this.newUser).subscribe({
      next: () => {
        this.newUser = { Name: '' };
        this.loadUsers();
      },
      error: (error) => console.error('Error creating user:', error)
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
