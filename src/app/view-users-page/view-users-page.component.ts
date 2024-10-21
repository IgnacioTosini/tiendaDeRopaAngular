import { Component } from '@angular/core';
import { UserFilterFormComponent } from '../user-filter-form/user-filter-form.component';

@Component({
  selector: 'app-view-users-page',
  standalone: true,
  imports: [UserFilterFormComponent],
  templateUrl: './view-users-page.component.html',
  styleUrl: './view-users-page.component.scss'
})
export class ViewUsersPageComponent {

}
