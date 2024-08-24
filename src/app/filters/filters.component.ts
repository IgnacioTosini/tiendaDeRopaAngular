import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() nameFilter: string = '';
  @Input() minPriceFilter: number | null = null;
  @Input() maxPriceFilter: number | null = null;
  @Input() typeFilter: string = '';
  @Input() genericTypes: string[] = [];
  @Input() groupedTypes: { [key: string]: string[] } = {};

  @Output() sortChanged = new EventEmitter<'name' | 'price' | 'price-desc'>();
  @Output() applyFiltersEvent = new EventEmitter<{ nameFilter: string; minPriceFilter: number | null; maxPriceFilter: number | null; typeFilter: string; }>();

  applyFilters() {
    this.applyFiltersEvent.emit({ nameFilter: this.nameFilter, minPriceFilter: this.minPriceFilter, maxPriceFilter: this.maxPriceFilter, typeFilter: this.typeFilter });
  }

  setSortOrder(order: 'name' | 'price' | 'price-desc') {
    this.sortChanged.emit(order);
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
}
