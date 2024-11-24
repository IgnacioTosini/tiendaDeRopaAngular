import { LocalStorageService } from './local-storage.service';
import { Wish } from '../models/wish.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { catchError, tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { Pagination } from '../models/pagination.model';
import { GlobalConstants } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${GlobalConstants.apiUrl}/api/users`;
  usersArray: Array<User> = [];
  userRole: string = '';
  userRoles: string[] = [];
  userPassword: string = '';
  userLoguer: User = new User(0, "", "", "", "", "", [], [], '');
  token = "";
  httpClient = inject(HttpClient);
  private headers = new HttpHeaders({ "Content-Type": "application/json" });
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    })
  };

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  getUsers(page: number, cant: number): Observable<{ users: User[], pagination: Pagination }> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&cant=${cant}`, this.getUserToken('')).pipe(
      map(response => {
        this.usersArray = [];
        console.log(response);
        response.body.content.forEach((item: any) => {
          const existingUser = this.usersArray.find(u => u instanceof User && u.getId() === item.id);
          if (!existingUser) {
            const userwisheList = item.wisheList.map((wishItem: any) => new Wish(wishItem.id, wishItem.url, wishItem.name, wishItem.photo, wishItem.users));
            const userComments = item.comments.map((commentItem: any) => new Comment(commentItem.id, commentItem.text, commentItem.avalible, commentItem.user, commentItem.clothe));
            this.usersArray.push(new User(
              item.id,
              item.name,
              item.lastname,
              item.tel,
              item.image,
              item.email,
              userwisheList,
              userComments,
              item.vip
            ));
            this.setRoles(item.roles[0].name);
            this.setPassword(item.password);
          }
        });

        const pagination = new Pagination(
          response.body.totalElements,
          response.body.totalPages,
          response.body.size,
          response.body.number,
          response.body.first,
          response.body.last,
          response.body.numberOfElements
        );

        return { users: this.usersArray, pagination };
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(error);
      })
    );
  }

  register(user: any): Observable<any> {
    const password = user.password;
    let newUser = {
      name: user.name,
      lastname: user.lastname,
      tel: user.tel,
      image: user.image,
      email: user.email,
      wisheList: user.wisheList,
      comments: user.comments,
      vip: false,
    };

    return this.http.post<any>(`${this.apiUrl}/register/${password}`, newUser, { headers: this.headers }).pipe(
      tap(response => console.log('Response:', response)),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  saveToken(token: string) {
    this.token = token;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    console.log('Token saved:', token);
    console.log('HTTP Options updated:', this.httpOptions);
  }

  recoverUser() {
    const userString = this.localStorageService.getItem("user");
    return this.userLoguer = userString ? JSON.parse(userString) : new User(0, "", "", "", "", "", [], [], "");
  }

  updatePassword(id: string, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePassword/${id}/${password}`, {}, this.getUserToken(''));
  }

  updateUser(user: User): Observable<any> {
    console.log(user)
    return this.http.put(`${this.apiUrl}/update`, user).pipe(
      catchError(error => {
        console.error('Ocurrió un error al actualizar el usuario:', error);
        return throwError(error);
      })
    );
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`, this.getUserToken('')).pipe(
      map(response => {
        const data = response.body;
        let user = this.usersArray.find(u => u instanceof User && u.getId() === data.id);
        if (!user) {
          const userwisheList = data.wisheList.map((wishItem: any) => new Wish(wishItem.id, wishItem.url, wishItem.name, wishItem.photo, wishItem.users));
          const userComments = data.comments.map((commentItem: any) => new Comment(commentItem.id, commentItem.text, commentItem.avalible, commentItem.user, commentItem.clothe));
          user = new User(
            data.id,
            data.name,
            data.lastname,
            data.tel,
            data.image,
            data.email,
            userwisheList,
            userComments,
            data.vip
          );
          this.usersArray.push(user);
        }
        this.setRole(data.roles[0].name);
        this.setPassword(data.password);
        this.usersArray.sort((a, b) => Number(a.getId()) - Number(b.getId()));
        this.localStorageService.setItem("user", JSON.stringify(user));
        return this.usersArray.find(u => u instanceof User && u.getId() === data.id) || new User(0, '', '', '', '', '', [], [], '');
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.localStorageService.setItem("token", "");
          this.localStorageService.setItem("log", "false");
          this.localStorageService.setItem("user", "");
        }
        return throwError(error);
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

  getUserByEmail(email: string, token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`, this.getUserToken(token)).pipe(
      map(response => {
        const data = response.body;
        if (!data) {
          throw new Error('Response body is empty');
        }
        let user = this.usersArray.find(u => u instanceof User && u.getId() === data.id);
        if (!user) {
          const userwisheList = data.wisheList.map((wishItem: any) => new Wish(wishItem.id, wishItem.url, wishItem.name, wishItem.photo, wishItem.users));
          const userComments = data.comments.map((commentItem: any) => new Comment(commentItem.id, commentItem.text, commentItem.avalible, commentItem.user, commentItem.clothe));
          user = new User(
            data.id,
            data.name,
            data.lastname,
            data.tel,
            data.image,
            data.email,
            userwisheList,
            userComments,
            data.vip
          );
          this.usersArray.push(user);
        }
        this.setRole(data.roles[0].name);
        this.setPassword(data.password);
        this.usersArray.sort((a, b) => Number(a.getId()) - Number(b.getId()));
        this.localStorageService.setItem("user", JSON.stringify(user));
        return this.usersArray.find(u => u instanceof User && u.getId() === data.id) || new User(0, '', '', '', '', '', [], [], '');
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error);
      })
    );
  }

  async getUserRole(): Promise<string> {
    if (this.userRole) {
      return this.userRole;
    }

    const userId = this.getUserId();
    if (!userId) {
      return Promise.reject('User ID not found');
    }

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.userRole) {
          clearInterval(interval);
          resolve(this.userRole);
        }
      }, 100); // Verifica cada 100ms si el rol está disponible

      // Timeout después de 5 segundos si no se obtiene el rol
      setTimeout(() => {
        clearInterval(interval);
        if (!this.userRole) {
          reject('User role not found');
        }
      }, 5000);
    });
  }

  getUserRoles(): string[] {
    return this.userRoles;
  }

  getUserPassword(): string {
    return this.userPassword;
  }

  getUsersByLastname(lastname: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lastname/${lastname}?page=${page}&size=${size}`, this.getUserToken('')).pipe(
      map(response => {
        const users = response.body;
        users.forEach((data: any) => {
          const existingUser = this.usersArray.find(u => u instanceof User && u.getLastname() === data.lastname);
          if (!existingUser) {
            const userwisheList = data.wisheList.map((wishItem: any) => new Wish(wishItem.id, wishItem.url, wishItem.name, wishItem.photo, wishItem.users));
            const userComments = data.comments.map((commentItem: any) => new Comment(commentItem.id, commentItem.text, commentItem.avalible, commentItem.user, commentItem.clothe));
            this.usersArray.push(new User(
              data.id,
              data.name,
              data.lastname,
              data.tel,
              data.image,
              data.email,
              userwisheList,
              userComments,
              data.vip
            ));
          }
        });
        this.usersArray.sort((a, b) => a instanceof User && b instanceof User ? Number(a.getId()) - Number(b.getId()) : 0);
        return this.usersArray;
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return of(null);
      })
    );
  }

  addToWisheList(code: number, wish: any): Observable<any> {
    console.log(wish);
    return this.http.put(`${this.apiUrl}/wish/${code}`, wish, this.getUserToken('')).pipe(
      catchError(error => throwError(() => new Error('Error al agregar a favoritos: ' + error)))
    );
  }

  removeFromWisheList(userId: number, clotheId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/wish/delete/${userId}/${clotheId}`, this.getUserToken('')).pipe(
      catchError(error => throwError(() => new Error('Error al remover de favoritos: ' + error.message)))
    );
  }

  detectWish(idUser: number, idWish: string): Observable<boolean> {
    if (!idUser || !idWish) {
      console.error('Invalid user ID or wish ID', 'id user', idUser, 'id wish', idWish);
      return throwError('Invalid user ID or wish ID');
    }
    return this.http.get<any>(`${this.apiUrl}/detectWish/${idUser}/${idWish}`, this.getUserToken('')).pipe(
      map(response => response.body),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error);
      })
    );
  }

  getUserToken(token: string): { headers: HttpHeaders } {
    let tokenStorage = "";
    if (this.localStorageService.getItem("token") == '') {
      tokenStorage = token;
    } else {
      tokenStorage = this.localStorageService.getItem("token") || '';
    }
    const http = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokenStorage
      })
    };
    return http;
  }

  getUserId() {
    let user = this.localStorageService.getItem("user");
    if (user) {
      return JSON.parse(user).id;
    }
  }
}
