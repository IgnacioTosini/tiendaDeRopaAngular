import { LocalStorageService } from './local-storage.service';
import { Wish } from '../models/wish.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { catchError, tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
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

  getUsers(): Observable<User[]> {
    return this.http.get<{ message: string, body: any[], status: number }>(`${this.apiUrl}`, this.getUserToken('')).pipe(
      map(response => {
        this.usersArray = [];
        response.body.forEach(item => {
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
        return this.usersArray;
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

    console.log('Creating user with data:', newUser);
    console.log('HTTP Options:', this.httpOptions);

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
        // Aquí puedes manejar el error como quieras. Por ejemplo, podrías mostrar un mensaje de error al usuario.
        console.error('Ocurrió un error al actualizar el usuario:', error);
        return throwError(error);
      })
    );
  }

  getUserById(id: string): Observable<any> {
    const token = this.localStorageService.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ message: string, body: any, status: number }>(`${this.apiUrl}/id/${id}`, { headers }).pipe(
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
    return this.http.get<{ message: string, body: any, status: number }>(`${this.apiUrl}/email/${email}`, this.getUserToken(token)).pipe(
      map(response => {
        const data = response.body; // Accede a la propiedad body de la respuesta
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
        this.usersArray.sort((a, b) => Number(a.getId()) - Number(b.getId())); // Se ordena por ID
        this.localStorageService.setItem("user", JSON.stringify(user));
        return this.usersArray.find(u => u instanceof User && u.getId() === data.id) || new User(0, '', '', '', '', '', [], [], '');
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error);
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
    return this.http.get<{ message: string, body: any[], status: number }>(`${this.apiUrl}/lastname/${lastname}`, this.getUserToken('')).pipe(
      map(response => {
        const users = response.body; // Asume que la respuesta es un array de usuarios
        users.forEach(data => {
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
        this.usersArray.sort((a, b) => a instanceof User && b instanceof User ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.usersArray;
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return of(null);
      })
    );
  }

  // Método para agregar a favoritos un producto
  addToWisheList(code: number, wish: any): Observable<any> {
    console.log(wish);
    return this.http.put(`${this.apiUrl}/wish/${code}`, wish, this.getUserToken('')).pipe(
      catchError(error => throwError(() => new Error('Error al agregar a favoritos: ' + error)))
    );
  }

  // Método para remover un producto de favoritos
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
    return this.http.get<{ message: string, body: boolean, status: number }>(`${this.apiUrl}/detectWish/${idUser}/${idWish}`, this.getUserToken('')).pipe(
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
