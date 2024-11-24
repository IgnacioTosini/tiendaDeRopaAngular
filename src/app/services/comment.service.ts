import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { UserService } from './user.service';
import { GlobalConstants } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${GlobalConstants.apiUrl}/api/comments`;

  constructor(private http: HttpClient, private userService: UserService) { }

  addComment(comment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, comment, this.userService.getUserToken(''));
  }

  deleteComment(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/delete/${id}`, this.userService.getUserToken(''));
  }

  findComments(idClothe: string, page: number, cant: number): Observable<Comment[]> {
    return this.http.get<any>(`${this.baseUrl}/find/${idClothe}?page=${page}&cant=${cant}`, this.userService.getUserToken('')).pipe(
      map(response => {
        console.log('Response:', response);
        if (response.body) {
          const comments = response.body;
          return comments.map((item: any) => ({
            comment: item.comment,
            fullname: item.fullname,
            image: item.image
          }));
        } else {
          throw new Error('Response does not contain the expected arrays');
        }
      }),
      tap(comments => console.log('Comments:', comments)),
      catchError(error => {
        if (error.status === 404) {
          console.info('No hay comentarios para este producto.');
          return of([]); // Devuelve un array vacío si no se encuentran comentarios
        } else {
          return throwError(error); // Lanza otros errores
        }
      })
    );
  }
}
