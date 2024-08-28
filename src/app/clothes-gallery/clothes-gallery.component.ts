import { Component, ViewChild, OnInit } from '@angular/core';
import { ClothesStockService } from './../services/clothes-stock.service';
import { ClothesStock } from '../models/clothesStock.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageWrapperComponent } from '../image-wrapper/image-wrapper.component';
import { FiltersComponent } from '../filters/filters.component';
import { ActiveFiltersComponent } from '../active-filters/active-filters.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-clothes-gallery',
  standalone: true,
  imports: [FormsModule, ImageWrapperComponent, FiltersComponent, ActiveFiltersComponent, PaginationComponent],
  templateUrl: './clothes-gallery.component.html',
  styleUrls: ['./clothes-gallery.component.scss']
})
export class ClothesGalleryComponent implements OnInit {
  @ViewChild(FiltersComponent) filtersComponent!: FiltersComponent;

  clothes: ClothesStock[] = [];
  filteredClothes: ClothesStock[] = [];
  nameFilter: string = '';
  minPriceFilter: number | null = null;
  maxPriceFilter: number | null = null;
  sortOrder: 'name' | 'price' | 'price-desc' | null = null;
  typeFilter: string = '';
  groupedTypes: { [key: string]: string[] } = {};
  genericTypes: string[] = [];
  pageSize: number = 8;
  pageIndex: number = 0;

  constructor(private ClothesStockService: ClothesStockService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    await this.loadClothes();
    this.route.params.subscribe(params => {
      this.typeFilter = params['type'];
      this.applyFilters();
    });
    this.filtersComponent.filtersChanged.subscribe(() => this.handleFiltersChanged());
  }

  async loadClothes() {
    await this.ClothesStockService.findAll().toPromise();
    this.clothes = this.ClothesStockService.clothesArray;
    this.groupedTypes = this.clothes.reduce((acc: { [key: string]: string[] }, curr) => {
      if (!acc[curr.getGenericType()]) {
        acc[curr.getGenericType()] = [];
      }
      acc[curr.getGenericType()].push(curr.getSpecificType());
      return acc;
    }, {});

    for (let genericType in this.groupedTypes) {
      this.groupedTypes[genericType] = Array.from(new Set(this.groupedTypes[genericType]));
    }

    this.genericTypes = Object.keys(this.groupedTypes);

    this.filtersComponent.clothes = this.clothes;
    this.applyFilters();
  }

  applyFilters() {
    this.filtersComponent.applyFilters();
  }

  handleFilteredClothes(filtered: ClothesStock[]) {
    this.filteredClothes = filtered;
    this.adjustPageIndex();
  }

  setSortOrder(order: 'name' | 'price' | 'price-desc') {
    this.sortOrder = order;
    this.filtersComponent.setSortOrder(order);
  }

  adjustPageIndex() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    if (this.filteredClothes.slice(start, end).length === 0) {
      this.pageIndex = 0;
    }
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]);
  }

  get currentPageItems(): ClothesStock[] {
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

  handleResetFilter(filterName: string) {
    this.filtersComponent.resetFilter(filterName);
    this.applyFilters();
  }

  changeImage(index: number, change: number) {
    const clothe = this.clothes[index];
    const imagesCount = clothe.getImages().length;
    clothe.currentImage = (clothe.currentImage + change + imagesCount) % imagesCount;
  }

  setActiveImage(index: number, imageIndex: number) {
    this.clothes[index].currentImage = imageIndex;
  }

  trackByClothe(index: number, clothe: ClothesStock) {
    return clothe.getCode();
  }

  getSizesForProduct(code: string): string {
    const clothe = this.clothes.find(c => c.getCode() === code);
    return clothe ? clothe.getSize() : '';
  }

  handleFiltersChanged() {
    this.nameFilter = this.filtersComponent.nameFilter;
    this.minPriceFilter = this.filtersComponent.minPriceFilter;
    this.maxPriceFilter = this.filtersComponent.maxPriceFilter;
    this.typeFilter = this.filtersComponent.typeFilter;
  }
}
