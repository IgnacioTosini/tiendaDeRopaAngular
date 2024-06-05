import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  usersArray: Array<User> = [];
  userRole: string = '';
  userRoles: string[] = [];
  userPassword: string = '';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map(data => {
        this.usersArray = [];
        data.forEach(item => {
          const existingUser = this.usersArray.find(u => u instanceof User && u.getId() === item.id);
          if (!existingUser) {
            this.usersArray.push(new User(
              item.id,
              item.name,
              item.lastname,
              item.tel,
              item.image,
              item.email
            ));
            this.setRoles(item.roles[0].name);
            this.setPassword(item.password);
          }
        });
        this.usersArray.sort((a, b) => a instanceof User && b instanceof User ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.usersArray;
      })
    );
  }

  createUser(user: any): Observable<any> {
    let password = user.password;
    let newUser = new User(user.id, user.name, user.lastname, user.tel, user.image, user.email);
    return this.http.post(`${this.apiUrl}/${password}`, newUser);
  }

  updatePassword(id: string, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePassword/${id}/${password}`, {});
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, user);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`).pipe(
      map(data => {
        const existingUser = this.usersArray.find(u => u instanceof User && u.getId() === data.id);
        if (!existingUser) {
          this.usersArray.push(new User(
            data.id,
            data.name,
            data.lastname,
            data.tel,
            data.image,
            data.email
          ));
          this.setRole(data.roles[0].name);
          this.setPassword(data.password);
        }
        this.usersArray.sort((a, b) => a instanceof User && b instanceof User ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.usersArray.find(u => u instanceof User && u.getId() === data.id) || new User('', '', '', '', '', '');
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return of(null);
      })
    );
  }

  setRole(role: string) {
    this.userRole = role;
  }

  setRoles(role: string) {
    this.userRoles.push(role);
  }

  setPassword(password: string) {
    this.userPassword = password;
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`).pipe(
      map(data => {
        const existingUser = this.usersArray.find(u => u instanceof User && u.getEmail() === data.email);
        console.log(data)
        if (!existingUser) {
          this.usersArray.push(new User(
            data.id,
            data.name,
            data.lastname,
            data.tel,
            data.image,
            data.email
          ));
          this.setRole(data.roles[0].name);
          this.setPassword(data.password);
        }
        this.usersArray.sort((a, b) => a instanceof User && b instanceof User ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.usersArray.find(u => u instanceof User && u.getId() === data.id) || new User('', '', '', '', '', '');
      })
    );
  }

  // Método para obtener el rol del usuario
  getUserRole(): string {
    return this.userRole;
  }

  getUserRoles(): string[] {
    return this.userRoles;
  }

  getUserPassword(): string {
    return this.userPassword;
  }

  getUsersByLastname(lastname: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lastname/${lastname}`).pipe(
      map(data => {
        const existingUser = this.usersArray.find(u => u instanceof User && u.getLastname() === data.lastName);
        if (!existingUser) {
          this.usersArray.push(new User(
            data.id,
            data.name,
            data.lastname,
            data.tel,
            data.image,
            data.email
          ));
        }
        this.usersArray.sort((a, b) => a instanceof User && b instanceof User ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.usersArray.find(u => u instanceof User && u.getId() === data.id) || new User('', '', '', '', '', '');
      })
    );
  }
}
