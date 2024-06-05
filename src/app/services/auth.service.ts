import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User = new User('', '', '', '', '', '');
  users: User[] = [];
  isLoggedIn: Boolean = false;
  isAdminIn: Boolean = false;

  constructor(private userService: UserService, private localStorageService: LocalStorageService, private router: Router) { }

  async login(email: string) {
    let flag = false;
    let value = 0;
    this.userService.getUsers().subscribe((users: any[]) => {
      this.users = users.map(user => new User(user.id, user.name, user.lastname, user.tel, user.image, user.email));
      for (let i = 0; i < this.users.length && flag == false; i++) {
        if (this.users[i].getEmail() == email) {
          this.user = this.users[i];
          value = 0;
          this.localStorageService.setItem("token", this.user.getId().toString()); // Convert the number to a string
          this.localStorageService.setItem("log", "true");
          flag = true;
          this.validateLogin();
        } else {
          value = 1;
        }
      }
    });
    return value;
  }

  logOut() {
    this.user = new User('', '', '', '', '', '');
    this.localStorageService.setItem("token", "0");
    this.localStorageService.setItem("log", "false");
    this.isLoggedIn = false;
    this.router.navigate(["/home"]).then(() => {
      window.location.reload();
    });
  }

  validateLogin() {
    let token = this.localStorageService.getItem("token");
    let log = this.localStorageService.getItem("log");

    let flag = false;
    for (let i = 0; i < this.users.length && flag == false; i++) {
      if (String(this.users[i].getId()) === token && log === 'true') {
        this.user = this.users[i];
        flag = true;
        this.isLoggedIn = true;
      }
    }
    this.router.navigate(["/home"]).then(() => {
      window.location.reload();
    });
  }

  get UserAdmin(): Boolean {
    if (this.userService.getUserRole() == 'ROLE_ADMIN') {
      this.isAdminIn = true;
    }
    return this.isAdminIn;
  }

  get UserLogged(): boolean {
    let log = this.localStorageService.getItem("log");
    if (log === 'true') {
      return true;
    } else {
      return false;
    }
  }

  get UserData(): Promise<User> {
    let userId = this.localStorageService.getItem("token");
    if (!userId) {
      return Promise.reject('User ID not found in local storage');
    }
    return new Promise((resolve, reject) => {
      this.userService.getUserById(userId).subscribe((user: any) => {
        if (user) {
          this.user.setImage(user.image);
          resolve(this.user);
        } else {
          reject('User not found');
        }
      }, reject);
    });
  }
}
