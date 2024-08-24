import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient, private userService: UserService) { }

  addComment(comment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, comment, this.userService.getUserToken(''));
  }

  deleteComment(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/delete/${id}`, this.userService.getUserToken(''));
  }

  findComments(idClothe: string): Observable<Comment[]> {
    return this.http.get<any>(`${this.baseUrl}/find/${idClothe}`, this.userService.getUserToken('')).pipe(
      map(response => {
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
      tap(comments => console.log('Comments:', comments))
    );
  }
}
