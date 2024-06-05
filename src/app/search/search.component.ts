import { ClothesStockService } from './../services/clothes-stock.service';
import { Router } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClothesStock } from '../models/clothesStock.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery: string = '';
  searchResults: ClothesStock[] = [];

  constructor(private router: Router, private clothesStockService: ClothesStockService) { }

  ngOnInit() { }

  async searchClothes() {
    if (this.searchQuery) {
      try {
        const clothes = await this.clothesStockService.findAll().toPromise();
        this.searchResults = clothes?.filter(clothe =>
          clothe.getName().toLowerCase().includes(this.searchQuery.toLowerCase())
        ) || [];
      } catch (error) {
        console.error('Error getting clothes:', error);
        this.searchResults = [];
      }
      this.search.emit(this.searchQuery);
    } else {
      this.searchResults = [];
    }
  }

  clearSearch() {
    setTimeout(() => {
      this.searchQuery = '';
      this.searchResults = [];
    }, 100);
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]);
  }
}
