import { Injectable } from '@angular/core';
import { ClothesStockService } from './clothes-stock.service';
import { ClothesStock } from '../models/clothesStock.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private clothesStockService: ClothesStockService) {}

  async searchClothes(query: string): Promise<ClothesStock[]> {
    try {
      const result = await this.clothesStockService.findAll(0, 10).toPromise();
      return result?.clothes.filter(clothe =>
        clothe.getName().toLowerCase().includes(query.toLowerCase())
      ) || [];
    } catch (error) {
      console.error('Error getting clothes:', error);
      return [];
    }
  }
}
