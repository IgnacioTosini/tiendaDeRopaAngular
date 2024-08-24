import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tax } from '../models/tax.model';
import { ClothesSold } from '../models/clothesSold.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private baseUrl = 'http://localhost:8080/api/taxs';
  invoiceArray: Array<Tax> = [];

  constructor(private http: HttpClient, private userService: UserService) { }

  findAllTaxUser(idUser: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idUser}`, this.userService.getUserToken('')).pipe(
      map(data => {
        this.invoiceArray = [];
        console.log(data);
        data.forEach((item: any) => {
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
        this.invoiceArray.sort((a, b) => a instanceof Tax && b instanceof Tax ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.invoiceArray;
      })
    );
  }

  findAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, this.userService.getUserToken('')).pipe(
      map(data => {
        this.invoiceArray = [];
        console.log(data);
        data.forEach((item: any) => {
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
        this.invoiceArray.sort((a, b) => a instanceof Tax && b instanceof Tax ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.invoiceArray;
      })
    );
  }

  create(idUser: number, tax: Tax): Observable<Object> {
    return this.http.post(`${this.baseUrl}/${idUser}`, tax, this.userService.getUserToken(''));
  }

  findByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/code/${code}`, this.userService.getUserToken('')).pipe(
      map(data => {
        this.invoiceArray = [];
        const existingInvoice = this.invoiceArray.find(u => u instanceof Tax && u.getId() === data.id);
        if (!existingInvoice) {
          const clothesArray = data.clothes;
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
            data.id,
            data.price,
            data.code,
            data.adress,
            data.travelCost,
            data.date,
            newClothes
          ));
        }
        this.invoiceArray.sort((a, b) => a instanceof Tax && b instanceof Tax ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.invoiceArray;
      })
    );
  }

  findByDate(date: Date): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/date`, { params: { date: date.toISOString() } }).pipe(
      map(data => {
        this.invoiceArray = [];
        const existingInvoice = this.invoiceArray.find(u => u instanceof Tax && u.getId() === data.id);
        if (!existingInvoice) {
          const clothesArray = data.clothes;
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
            data.id,
            data.price,
            data.code,
            data.adress,
            data.travelCost,
            data.date,
            newClothes
          ));
        }
        this.invoiceArray.sort((a, b) => a instanceof Tax && b instanceof Tax ? Number(a.getId()) - Number(b.getId()) : 0); // Se ordena por ID
        return this.invoiceArray;
      })
    );
  }
}
