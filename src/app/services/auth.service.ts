import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User = new User(0, '', '', '', '', '', [], [], '');
  users: User[] = [];
  isLoggedIn: Boolean = false;
  isAdminIn: Boolean = false;
  private apiUrl = "http://localhost:8080";
  private headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  login(email: string, password: string): Observable<any> {
    const loginData = {
      email: email,
      password: password
    };
    return this.httpClient.post(`${this.apiUrl}/login`, loginData, { headers: this.headers });
  }

  handleLoginResponse(response: any) {
    const token = response.token;
    this.localStorageService.setItem("token", token);
    this.localStorageService.setItem("log", "true");
    this.isLoggedIn = true;
    this.router.navigate(["/home"]).then(() => {
      window.location.reload();
    });
  }

  logOut() {
    this.user = new User(0, '', '', '', '', '', [], [], '');
    this.localStorageService.setItem("token", "");
    this.localStorageService.setItem("log", "false");
    this.localStorageService.setItem("user", "");
    this.isLoggedIn = false;
    this.router.navigate(["/home"]).then(() => {
      window.location.reload();
    });
  }

  async isAdmin(): Promise<boolean> {
    const role = await this.userService.getUserRole();
    if (role === 'ROLE_ADMIN') {
      this.isAdminIn = true;
      return true;
    } else {
      this.isAdminIn = false;
      return false;
    }
  }

  get UserLogged(): boolean {
    const log = this.localStorageService.getItem("log");
    return log === 'true';
  }

  get UserData(): Promise<User> {
    let user = this.userService.recoverUser();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let token = this.localStorageService.getItem("token");
        if (!token) {
          reject('User ID not found in local storage');
        } else {
          this.userService.getUserById(user.id).subscribe((user: any) => {
            if (user) {
              this.user.setImage(user.image);
              this.user.setEmail(user.email);
              this.user.setId(user.id);
              this.user.setName(user.name);
              this.user.setLastname(user.lastname);
              this.user.setCellphone(user.tel);
              this.user.setWisheList(user.wisheList);
              this.user.setComments(user.comments);
              resolve(this.user);
            } else {
              reject('User not found');
            }
          }, reject);
        }
      }, 1000);
    });
  }
}
