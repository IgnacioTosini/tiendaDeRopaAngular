import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClothesStock } from '../models/clothesStock.model';
import { Image } from '../models/images.model';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClothesStockService {
  private apiUrl = 'http://localhost:8080/api/clothes';
  clothesArray: Array<ClothesStock> = [];

  constructor(private http: HttpClient) { }

  findAll(): Observable<ClothesStock[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map(data => {
        this.clothesArray = [];
        data.forEach(item => {
          const existingClothes = this.clothesArray.find(clothes => clothes.getId() === item.id);
          if (!existingClothes) {
            const images = (Array.isArray(item.images) ? item.images : [item.images]).map((image: any) => new Image(image.id, image.url));
            const newClothes = new ClothesStock(
              item.id,
              item.name,
              item.price,
              item.code,
              item.size.toUpperCase(),
              images,
              item.description,
              item.genericType,
              item.specificType,
              item.publication,
              item.stock
            );
            this.clothesArray.push(newClothes);
          }
        });
        this.clothesArray.sort((a, b) => Number(a.getId()) - Number(b.getId())); // Se ordena por ID
        return this.clothesArray;
      })
    );
  }

  createUpdate(clothe: Object): Observable<any> {
    console.log('createUpdate', clothe);
    return this.http.post<any>(`${this.apiUrl}`, clothe);
  }

  findByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/code/${code}`).pipe(
      map((response: any) => {
        return response.map((item: any) => {
          const images = (Array.isArray(item.images) ? item.images : [item.images]).map((image: any) => new Image(image.id, image.url));
          const clothes = new ClothesStock(
            item.id,
            item.name,
            item.price,
            item.code,
            item.size,
            images,
            item.description,
            item.genericType,
            item.specificType,
            item.publication,
            item.stock
          );
          return clothes;
        });
      })
    );
  }

  findClothesByParameters(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/find`, { params }).pipe(
      map(data => {
        this.clothesArray = [];
        data.forEach((item: any) => {
          const existingClothes = this.clothesArray.find(clothes => clothes.getId() === item.id);
          if (!existingClothes) {
            const images = (Array.isArray(item.images) ? item.images : [item.images]).map((image: any) => new Image(image.id, image.url));
            const newClothes = new ClothesStock(
              item.id,
              item.name,
              item.price,
              item.code,
              item.size,
              images,
              item.description,
              item.genericType,
              item.specificType,
              item.publication,
              item.stock
            );
            this.clothesArray.push(newClothes);
          }
        });
        this.clothesArray.sort((a, b) => Number(a.getId()) - Number(b.getId())); // Se ordena por ID
        return this.clothesArray;
      }),
      catchError(error => {
        console.error('Error fetching clothes:', error);
        return EMPTY;
      })
    );
  }
}
