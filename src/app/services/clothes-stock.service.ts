import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClothesStock } from '../models/clothesStock.model';

@Injectable({
  providedIn: 'root'
})
export class ClothesStockService {
  private apiUrl = 'http://localhost:8080/api/clothes';
  public clothesArray: ClothesStock[] = [];

  constructor(private http: HttpClient) { }

  findAll(): Observable<ClothesStock[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map(data => {
        this.clothesArray = [];
        data.forEach(item => {
          const existingClothes = this.clothesArray.find(clothes => clothes.getId() === item.id);
          if (!existingClothes) {
            this.clothesArray.push(new ClothesStock(
              item.id,
              item.name,
              item.price,
              item.code,
              item.size,
              item.image,
              item.description,
              item.genericType,
              item.specificType,
              item.publicationDate,
              item.stock
            ));
          }
        });
        this.clothesArray.sort((a, b) => a.getId() - b.getId()); // Se ordena por ID
        return this.clothesArray;
      })
    );
  }

  createUpdate(clothe: Object): Observable<any> {
    console.log('createUpdate', clothe);
    return this.http.post<any>(`${this.apiUrl}`, clothe);
  }

  findByCode(code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/code/${code}`);
  }

  findClothesByParameters(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/find`, { params });
  }
}
