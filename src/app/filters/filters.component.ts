import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClothesStock } from '../models/clothesStock.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() clothes: ClothesStock[] = [];
  @Input() nameFilter: string = '';
  @Input() minPriceFilter: number | null = null;
  @Input() maxPriceFilter: number | null = null;
  @Input() typeFilter: string = 'Todas las Categorias';
  @Input() genericTypes: string[] = [];
  @Input() groupedTypes: { [key: string]: string[] } = {};
  @Output() filteredClothes = new EventEmitter<ClothesStock[]>();
  @Output() sortOrderChanged = new EventEmitter<'name' | 'price' | 'price-desc'>();
  @Output() filtersChanged = new EventEmitter<void>();

  private currentSortOrder: 'name' | 'price' | 'price-desc' | null = null;

  applyFilters() {
    let filtered = this.clothes;

    if (this.nameFilter) {
      filtered = filtered.filter(clothe => clothe.getName().toLowerCase().includes(this.nameFilter.toLowerCase()));
    }

    if (this.minPriceFilter !== null) {
      filtered = filtered.filter(clothe => clothe.getPrice() >= this.minPriceFilter!);
    }

    if (this.maxPriceFilter !== null) {
      filtered = filtered.filter(clothe => clothe.getPrice() <= this.maxPriceFilter!);
    }

    if (this.typeFilter && this.typeFilter !== 'Todas las Categorias') {
      filtered = filtered.filter(clothe => clothe.getSpecificType() === this.typeFilter);
    }

    if (this.currentSortOrder) {
      this.sortClothes(filtered, this.currentSortOrder);
    }

    this.filteredClothes.emit(filtered);
    this.filtersChanged.emit();
  }

  setSortOrder(order: 'name' | 'price' | 'price-desc') {
    if (this.currentSortOrder !== order) {
      this.currentSortOrder = order;
      this.sortOrderChanged.emit(order);
      this.applyFilters();
    }
  }

  private sortClothes(clothes: ClothesStock[], order: 'name' | 'price' | 'price-desc') {
    switch (order) {
      case 'name':
        clothes.sort((a, b) => a.getName().localeCompare(b.getName()));
        break;
      case 'price':
        clothes.sort((a, b) => a.getPrice() - b.getPrice());
        break;
      case 'price-desc':
        clothes.sort((a, b) => b.getPrice() - a.getPrice());
        break;
    }
  }

  resetFilter(filterName: string) {
    switch (filterName) {
      case 'name':
        this.nameFilter = '';
        break;
      case 'minPrice':
        this.minPriceFilter = null;
        break;
      case 'maxPrice':
        this.maxPriceFilter = null;
        break;
      case 'type':
        this.typeFilter = 'Todas las Categorias';
        break;
      case 'sortOrder':
        this.currentSortOrder = null;
        break;
    }
    this.applyFilters();
  }

  preventNumberInput(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  preventNumberInputCant(event: any) {
    const maxLength = 5;
    let inputField = event.target;
    if (inputField.value.length >= maxLength) {
      event.preventDefault();
    }
  }

  trackByGenericType(index: number, genericType: string): string {
    return genericType;
  }

  trackBySpecificType(index: number, specificType: string): string {
    return specificType;
  }
}
