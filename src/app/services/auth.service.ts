import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:8080/api/users';
  private user: User = new User(0, "", "", "", "", "");

  constructor(private http: HttpClient) {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    this.loggedIn.next(loggedIn);
    if (loggedIn) {
      this.validateLogin();
    }
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  async login(email: string) {
    let flag = false;
    let value = 0;
    const users: User[] = await this.http.get<User[]>(`${this.apiUrl}`).toPromise() || [];
    for (let i = 0; i < users.length && flag == false; i++) {
      if (users[i].getEmail() == email) {
          this.user = users[i];
          value = 0;
          localStorage.setItem("token", this.user.getId().toString()); // Convert the number to a string
          localStorage.setItem("loggedIn", "true");
          this.loggedIn.next(true);
          flag = true;
      } else {
        value = 1;
      }
    }
    return value;
  }

  logOut() {
    this.user = new User(0, "", "", "", "", "");
    localStorage.setItem("token","0");
    localStorage.setItem("loggedIn", "false");
    this.loggedIn.next(false);
  }

  async validateLogin(){
    let token = Number(localStorage.getItem("token"));
    let loggedIn = localStorage.getItem("loggedIn");

    let flag = false;
    const users: User[] = await this.http.get<User[]>(`${this.apiUrl}`).toPromise() ?? [];
    for(let i = 0; i<users.length && flag == false; i++){
      if(users[i].getId() === token && loggedIn === "true"){
        this.user = users[i];
        flag = true;
      }
    }
  }
}
