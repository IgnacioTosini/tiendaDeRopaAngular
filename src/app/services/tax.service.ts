import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tax } from '../models/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private baseUrl = 'http://localhost:8080/api/taxs';

  constructor(private http: HttpClient) { }

  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  create(idUser: string, tax: Tax): Observable<Object> {
    return this.http.post(`${this.baseUrl}/${idUser}`, tax);
  }

  findByCode(code: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/code/${code}`);
  }

  findByDate(date: Date): Observable<any> {
    return this.http.get(`${this.baseUrl}/date`, { params: { date: date.toISOString() } });
  }
}
