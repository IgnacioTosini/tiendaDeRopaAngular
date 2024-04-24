import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  createUser(user: any): Observable<any> {
    let password = user.password;
    let newUser = new User(user.id, user.name, user.lastname, user.tel, user.image, user.email);
    console.log(newUser);
    return this.http.post(`${this.apiUrl}/${password}`, newUser);
  }
  updatePassword(id: string, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePassword/${id}`, { password });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/id/${id}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email/${email}`);
  }

  getUsersByLastname(lastname: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lastname/${lastname}`);
  }
}
