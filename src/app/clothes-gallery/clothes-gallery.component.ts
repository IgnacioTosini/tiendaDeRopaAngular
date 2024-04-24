import { ClothesStockService } from './../services/clothes-stock.service';
import { Component } from '@angular/core';
import { Clothes } from '../models/clothes.model';
import { FormsModule } from '@angular/forms';
import { ClothesStock } from '../models/clothesStock.model';

@Component({
  selector: 'app-clothes-gallery',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clothes-gallery.component.html',
  styleUrl: './clothes-gallery.component.scss'
})
export class ClothesGalleryComponent {
  clothes: ClothesStock[] = []; // Modificado para ser un arreglo de Clothes
  filteredClothes: Clothes[] = [...this.clothes];
  nameFilter: string = '';
  sizeFilter: string = '';
  minPriceFilter: number = 0;
  maxPriceFilter: number = Infinity;
  pageSize: number = 5; // Cambia esto al número de elementos que quieres por página
  pageIndex: number = 0;
  sortOrder: 'name' | 'price' | 'price-desc' | null = null;

  constructor(private ClothesStockService: ClothesStockService) { }

  async ngOnInit() {
    await this.ClothesStockService.findAll().toPromise();
    this.clothes = this.ClothesStockService.clothesArray;
  }
  applyFilters() {
    let filtered = [...this.clothes];

    if (this.nameFilter) {
      const lowerCaseNameFilter = this.nameFilter.toLowerCase();
      filtered = filtered.filter(c => c.getName().toLowerCase().includes(lowerCaseNameFilter));
    }

    if (this.sizeFilter) {
      filtered = filtered.filter(c => c.getSize() === this.sizeFilter);
    }

    const minPrice = this.minPriceFilter || 0;
    const maxPrice = this.maxPriceFilter !== null && this.maxPriceFilter !== undefined ? this.maxPriceFilter : Infinity;
    filtered = filtered.filter(c => c.getPrice() >= minPrice && c.getPrice() <= maxPrice);

    this.filteredClothes = filtered;

    if (this.sortOrder) {
      this.filteredClothes.sort((a, b) => {
        if (this.sortOrder === 'name') {
          return a.getName().localeCompare(b.getName());
        } else if (this.sortOrder === 'price') {
          return a.getPrice() - b.getPrice();
        } else if (this.sortOrder === 'price-desc') {
          return b.getPrice() - a.getPrice();
        }
        return 0;
      });
    }
  }

  get currentPageItems(): Clothes[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredClothes.slice(start, end);
  }

  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.filteredClothes.length) {
      this.pageIndex++;
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  setSortOrder(order: 'name' | 'price' | 'price-desc' | null) {
    this.sortOrder = order;
    this.applyFilters();
  }
}
