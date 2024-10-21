import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, EMPTY, catchError } from 'rxjs';
import { ClothesStock } from '../models/clothesStock.model';
import { Image } from '../models/images.model';
import { UserService } from './user.service';
import { Pagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ClothesStockService {
  private apiUrl = 'http://localhost:8080/api/clothes';
  clothesArray: Array<ClothesStock> = [];
  private headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private http: HttpClient, private userService: UserService) { }

  findAll(page: number, size: number): Observable<{ clothes: ClothesStock[], pagination: Pagination }> {
    const params = {
      page: page,
      cant: size
    };

    return this.http.get<any>(`${this.apiUrl}`, { params, headers: this.headers }).pipe(
      map(response => {
        this.clothesArray = [];
        response.body.content.forEach((item: any) => {
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
              item.stock,
              item.comments
            );
            this.clothesArray.push(newClothes);
          }
        });
        this.clothesArray.sort((a, b) => Number(a.getId()) - Number(b.getId())); // Se ordena por ID

        const pagination = new Pagination(
          response.body.totalElements,
          response.body.totalPages,
          response.body.size,
          response.body.number,
          response.body.first,
          response.body.last,
          response.body.numberOfElements
        );

        return { clothes: this.clothesArray, pagination };
      }),
      catchError(error => {
        console.error(`Error al cargar la ropa:\nEstado: ${error.status}\nMensaje: ${error.message}`);
        return EMPTY;
      })
    );
  }

  createUpdate(clothe: any): Observable<any> {
    console.log('createUpdate', clothe);
    return this.http.post<any>(`${this.apiUrl}/create`, clothe, this.userService.getUserToken(''));
  }

  findByCode(code: string, page: number, cant: number): Observable<{ clothes: ClothesStock[], pagination: Pagination }> {
    return this.http.get<any>(`${this.apiUrl}/code/${code}?page=${page}&cant=${cant}`, this.userService.getUserToken('')).pipe(
      map(response => {
        const clothes = response.body.content.map((item: any) => {
          const images = (Array.isArray(item.images) ? item.images : [item.images]).map((image: any) => new Image(image.id, image.url));
          return new ClothesStock(
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
            item.stock,
            item.comments
          );
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

        return { clothes, pagination };
      })
    );
  }

  findClothesByParameters(params: any, page: number, size: number): Observable<ClothesStock[]> {
    const pageData = { page, cant: size };
    const queryParams = new URLSearchParams({ ...params, ...pageData }).toString();
    return this.http.get<any>(`${this.apiUrl}/find?${queryParams}`, this.userService.getUserToken('')).pipe(
      map(response => {
        this.clothesArray = [];
        response.body.content.forEach((item: any) => {
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
              item.stock,
              item.comments
            );
            this.clothesArray.push(newClothes);
          }
        });
        this.clothesArray.sort((a, b) => Number(a.getId()) - Number(b.getId())); // Se ordena por ID
        return this.clothesArray;
      }),
      catchError(error => {
        console.error(`Error al cargar la ropa:\nEstado: ${error.status}\nMensaje: ${error.message}`);
        return EMPTY;
      })
    );
  }
}
