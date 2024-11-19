import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Input() roles: string[] = [];

  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('User List - Clothing Store');
    this.meta.addTags([
      { name: 'description', content: 'List of users in the clothing store application' },
      { name: 'keywords', content: 'users, clothing store, user list' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: window.location.href },
    ]);
  }
}
