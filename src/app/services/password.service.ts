import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestorePasswordData } from '../models/restorePasswordData';
import { GlobalConstants } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private baseUrl = `${GlobalConstants.apiUrl}/restore/password`;

  constructor(private http: HttpClient) { }

  sendEmailPassword(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${email}`);
  }

  changePassword(restorePasswordData: RestorePasswordData): Observable<any> {
    return this.http.post(`${this.baseUrl}/change`, restorePasswordData);
  }
}
