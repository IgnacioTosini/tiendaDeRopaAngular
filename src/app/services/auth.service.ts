import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User = new User(0, '', '', '', '', '', [], [], '');
  users: User[] = [];
  isLoggedIn: Boolean = false;
  isAdminIn: Boolean = false;
  private apiUrl = GlobalConstants.apiUrl;
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

  async isAdmin(): Promise<Boolean> {
    try {
      const role = await this.userService.getUserRole();
      this.isAdminIn = role === 'ROLE_ADMIN';
      return this.isAdminIn;
    } catch (error) {
      console.error('Error fetching user role:', error);
      this.isAdminIn = false;
      return false;
    }
  }

  get UserLogged() {
    let log = false;
    log = this.localStorageService.getItem("log") === 'true';
    return log;
  }

  get UserData(): Promise<User> {
    let user = this.userService.recoverUser();
    return new Promise(async (resolve, reject) => {
      let token = this.localStorageService.getItem("token");
      if (!token) {
        console.warn('User ID not found in local storage');
        return;
      }
      try {
        const userData = await this.userService.getUserById(user.id).toPromise();
        if (userData) {
          this.user.setImage(userData.image);
          this.user.setEmail(userData.email);
          this.user.setId(userData.id);
          this.user.setName(userData.name);
          this.user.setLastname(userData.lastname);
          this.user.setCellphone(userData.tel);
          this.user.setWisheList(userData.wisheList);
          this.user.setComments(userData.comments);
          resolve(this.user);
        } else {
          reject('User not found');
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
