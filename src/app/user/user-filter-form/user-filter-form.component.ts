import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from '../user-list/user-list.component';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { User } from '../../models/user.model';
import { Pagination } from '../../models/pagination.model';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-filter-form',
  standalone: true,
  imports: [FormsModule, UserListComponent, PaginationComponent, ToastNotificationComponent],
  templateUrl: './user-filter-form.component.html',
  styleUrls: ['./user-filter-form.component.scss']
})
export class UserFilterFormComponent implements OnInit {
  users: User[] = [];
  roles: string[] = [];
  pagination: Pagination | null = null;
  currentPage: number = 0;
  pageSize: number = 2;
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(private userService: UserService, public notificationService: NotificationService, private meta: Meta, private title: Title, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.title.setTitle('User Filter Form - Clothing Store');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Filter and search users by ID or email in our clothing store.' },
      { name: 'keywords', content: 'user filter, search user, clothing store, user ID, user email' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }

  onGetUsers(page: number = 0) {
    this.userService.getUsers(page, this.pageSize).subscribe(response => {
      this.users = response.users;
      this.pagination = response.pagination;
      this.roles = this.userService.getUserRoles();
    });
  }

  onGetUserById(id: string) {
    if (!id) {
      this.notificationService.handleNotification('Por favor, ingrese un ID.', false);
      return;
    }

    this.userService.getUserById(id).subscribe(async user => {
      this.users = [user];
      this.roles = [await this.userService.getUserRole()];
    });
  }

  onGetUserByEmail(email: string) {
    if (!email) {
      this.notificationService.handleNotification('Por favor, ingrese un email.', false);
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
