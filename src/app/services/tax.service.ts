import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tax } from '../models/tax.model';
import { ClothesSold } from '../models/clothesSold.model';
import { UserService } from './user.service';
import { Pagination } from '../models/pagination.model';
import { GlobalConstants } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private baseUrl = `${GlobalConstants.apiUrl}/api/taxs`;
  invoiceArray: Array<Tax> = [];

  constructor(private http: HttpClient, private userService: UserService) { }

  findAllTaxUser(idUser: number, page: number, cant: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/find/${idUser}?page=${page}&cant=${cant}`, this.userService.getUserToken('')).pipe(
      map(data => {
        this.invoiceArray = [];
        console.log(data);
        data.body.content.forEach((item: any) => {
          const existingInvoice = this.invoiceArray.find(u => u instanceof Tax && u.getId() === item.id);
          if (!existingInvoice) {
            const clothesArray = item.clothes;
            const newClothes = clothesArray.map((clothes: any) => new ClothesSold(
              clothes.id,
              clothes.name,
              clothes.price,
              clothes.code,
              clothes.size,
              clothes.description,
              clothes.genericType,
              clothes.specificType,
              clothes.publication,
              clothes.cant
            ));
            this.invoiceArray.push(new Tax(
              item.id,
              item.price,
              item.code,
              item.adress,
              item.travelCost,
              item.date,
              [...newClothes] // Clonar el array de ropa
            ));
          }
        });

        const pagination = new Pagination(
          data.body.totalElements,
          data.body.totalPages,
          data.body.size,
          data.body.number,
          data.body.first,
          data.body.last,
          data.body.numberOfElements
        );
        return { invoice: this.invoiceArray, pagination: pagination };
      })
    );
  }

  findAll(page: number, cant: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}&cant=${cant}`, this.userService.getUserToken('')).pipe(
      map(data => {
        this.invoiceArray = [];
        console.log(data);
        data.body.content.forEach((item: any) => {
          const existingInvoice = this.invoiceArray.find(u => u instanceof Tax && u.getId() === item.id);
          if (!existingInvoice) {
            const clothesArray = item.clothes;
            const newClothes = clothesArray.map((clothes: any) => new ClothesSold(
              clothes.id,
              clothes.name,
              clothes.price,
              clothes.code,
              clothes.size,
              clothes.description,
              clothes.genericType,
              clothes.specificType,
              clothes.publication,
              clothes.cant
            ));
            this.invoiceArray.push(new Tax(
              item.id,
              item.price,
              item.code,
              item.adress,
              item.travelCost,
              item.date,
              newClothes
            ));
          }
        });

        const pagination = new Pagination(
          data.body.totalElements,
          data.body.totalPages,
          data.body.size,
          data.body.number,
          data.body.first,
          data.body.last,
          data.body.numberOfElements
        );
        return { invoice: this.invoiceArray, pagination: pagination };
      })
    );
  }

  create(idUser: string, tax: Tax): Observable<Object> {
    return this.http.post<any>(`${this.baseUrl}/${idUser}`, tax, this.userService.getUserToken(''));
  }

  findByCode(code: string, page: number, cant: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/code/${code}?page=${page}&cant=${cant}`, this.userService.getUserToken('')).pipe(
      map(data => {
        console.log(data);
        this.invoiceArray = [];
        const existingInvoice = this.invoiceArray.find(u => u instanceof Tax && u.getId() === data.body.id);
        if (!existingInvoice) {
          const clothesArray = data.body.clothes;
          const newClothes = clothesArray.map((clothes: any) => new ClothesSold(
            clothes.id,
            clothes.name,
            clothes.price,
            clothes.code,
            clothes.size,
            clothes.description,
            clothes.genericType,
            clothes.specificType,
            clothes.publication,
            clothes.cant
          ));
          this.invoiceArray.push(new Tax(
            data.body.id,
            data.body.price,
            data.body.code,
            data.body.adress,
            data.body.travelCost,
            data.body.date,
            newClothes
          ));
        }

        this.invoiceArray.sort((a, b) => a instanceof Tax && b instanceof Tax ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.invoiceArray;
      })
    );
  }

  findByDate(date: Date, page: number, cant: number): Observable<any> {
    const params = { date: date.toISOString().slice(0, 16), page: page, cant: cant }; // Formato yyyy-MM-dd'T'HH:mm
    console.log(params);
    const headers = this.userService.getUserToken('');
    return this.http.get<any>(`${this.baseUrl}/date`, { params, ...headers }).pipe(
      map(data => {
        this.invoiceArray = [];
        console.log(data);
        data.body.content.forEach((item: any) => {
          const existingInvoice = this.invoiceArray.find(u => u instanceof Tax && u.getId() === item.id);
          if (!existingInvoice) {
            const clothesArray = item.clothes;
            const newClothes = clothesArray.map((clothes: any) => new ClothesSold(
              clothes.id,
              clothes.name,
              clothes.price,
              clothes.code,
              clothes.size,
              clothes.description,
              clothes.genericType,
              clothes.specificType,
              clothes.publication,
              clothes.cant
            ));
            this.invoiceArray.push(new Tax(
              item.id,
              item.price,
              item.code,
              item.adress,
              item.travelCost,
              item.date,
              newClothes
            ));
          }
        });

        const pagination = new Pagination(
          data.body.totalElements,
          data.body.totalPages,
          data.body.size,
          data.body.number,
          data.body.first,
          data.body.last,
          data.body.numberOfElements
        );
        return { invoice: this.invoiceArray, pagination: pagination };
      })
    );
  }
}
