import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-active-filters',
  standalone: true,
  imports: [],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss'
})
export class ActiveFiltersComponent {
  @Input() nameFilter: string = '';
  @Input() minPriceFilter: number | null = null;
  @Input() maxPriceFilter: number | null = null;
  @Input() typeFilter: string = '';
  @Input() sortOrder: 'name' | 'price' | 'price-desc' | null = null;

  @Output() resetFilterEvent = new EventEmitter<string>();

  resetNameFilter() {
    this.nameFilter = '';
    this.resetFilterEvent.emit('name');
  }

  resetMinPriceFilter() {
    this.minPriceFilter = null;
    this.resetFilterEvent.emit('minPrice');
  }

  resetMaxPriceFilter() {
    this.maxPriceFilter = null;
    this.resetFilterEvent.emit('maxPrice');
  }

  resetTypeFilter() {
    this.typeFilter = '';
    this.resetFilterEvent.emit('type');
  }

  resetSortOrder() {
    this.sortOrder = null;
    this.resetFilterEvent.emit('sortOrder');
  }
}
