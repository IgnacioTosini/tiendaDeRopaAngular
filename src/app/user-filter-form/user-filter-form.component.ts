import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Pagination } from '../models/pagination.model';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from '../user-list/user-list.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-user-filter-form',
  standalone: true,
  imports: [FormsModule, UserListComponent, PaginationComponent, ToastNotificationComponent],
  templateUrl: './user-filter-form.component.html',
  styleUrl: './user-filter-form.component.scss'
})
export class UserFilterFormComponent {
  users: User[] = [];
  roles: string[] = [];
  pagination: Pagination | null = null;
  currentPage: number = 0;
  pageSize: number = 2;
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(private userService: UserService) {}

  onGetUsers(page: number = 0) {
    this.userService.getUsers(page, this.pageSize).subscribe(response => {
      this.users = response.users;
      this.pagination = response.pagination;
      this.roles = this.userService.getUserRoles();
    });
  }

  onGetUserById(id: string) {
    if (!id) {
      this.showNotification = true;
      this.notificationMessage = 'Por favor, ingrese un ID.';
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
      return;
    }

    this.userService.getUserById(id).subscribe(async user => {
      this.users = [user];
      this.roles = [await this.userService.getUserRole()];
    });
  }

  onGetUserByEmail(email: string) {
    if (!email) {
      this.showNotification = true;
      this.notificationMessage = 'Por favor, ingrese un email.';
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
      return;
    }

    this.userService.getUserByEmail(email, '').subscribe(async user => {
      this.users = [user];
      this.roles = [await this.userService.getUserRole()];
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.onGetUsers(page);
  }
}
