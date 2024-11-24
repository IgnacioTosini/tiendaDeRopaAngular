import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemMercadoPago } from '../models/ItemMercadoPago.model';
import { Preference } from 'mercadopago';
import { GlobalConstants } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  private apiUrl = `${GlobalConstants.apiUrl}/api/mercado`; // URL del controlador de Spring

  constructor(private http: HttpClient) { }

  // Método para crear preferencias
  createPreferences(items: Set<ItemMercadoPago>): Observable<Preference> {
    return this.http.post<Preference>(this.apiUrl, items);
  }
}
