import { Component } from '@angular/core';
import { ClothesStockService } from './../services/clothes-stock.service';
import { ClothesStock } from '../models/clothesStock.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageWrapperComponent } from '../image-wrapper/image-wrapper.component';
import { FiltersComponent } from '../filters/filters.component';
import { ActiveFiltersComponent } from '../active-filters/active-filters.component';

@Component({
  selector: 'app-clothes-gallery',
  standalone: true,
  imports: [FormsModule, ImageWrapperComponent, FiltersComponent, ActiveFiltersComponent],
  templateUrl: './clothes-gallery.component.html',
  styleUrls: ['./clothes-gallery.component.scss']
})
export class ClothesGalleryComponent {
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
  }

  handleApplyFilters(filters: { nameFilter: string; minPriceFilter: number | null; maxPriceFilter: number | null; typeFilter: string; }) {
    this.nameFilter = filters.nameFilter;
    this.minPriceFilter = filters.minPriceFilter;
    this.maxPriceFilter = filters.maxPriceFilter;
    this.typeFilter = filters.typeFilter;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredClothes = [];

    const params = this.getFilterParams();

    this.ClothesStockService.findClothesByParameters(params).subscribe(
      filteredClothes => {
        this.processFilteredClothes(filteredClothes);
      },
      error => {
        console.error('Error fetching clothes:', error);
      }
    );
  }

  getFilterParams() {
    return {
      name: this.nameFilter,
      type: this.typeFilter,
      minPrice: this.minPriceFilter,
      maxPrice: this.maxPriceFilter,
      sortOrder: this.sortOrder,
    };
  }

  filterByPrice(clothes: ClothesStock[]): ClothesStock[] {
    return clothes.filter(clothe => {
      let price = clothe.getPrice();
      return (this.minPriceFilter == null || price >= this.minPriceFilter) &&
        (this.maxPriceFilter == null || price <= this.maxPriceFilter);
    });
  }

  processFilteredClothes(filteredClothes: ClothesStock[]) {
    this.filteredClothes = this.removeDuplicates(filteredClothes);

    if (this.typeFilter) {
      this.filteredClothes = this.filterByType(this.filteredClothes);
    }
    if (this.minPriceFilter != null || this.maxPriceFilter != null) {
      this.filteredClothes = this.filterByPrice(this.filteredClothes);
    }
    if (this.sortOrder) {
      this.filteredClothes = this.sortClothes(this.filteredClothes);
    }

    this.adjustPageIndex();
  }

  removeDuplicates(clothes: ClothesStock[]): ClothesStock[] {
    return Array.from(new Set(clothes.map((c: ClothesStock) => c.getName())))
      .map((name: any) => {
        return clothes.find((c: ClothesStock) => c.getName() === name);
      })
      .filter((c: ClothesStock | undefined) => c !== undefined) as ClothesStock[];
  }

  filterByType(clothes: ClothesStock[]): ClothesStock[] {
    return clothes.filter((c: ClothesStock) => c.getGenericType() === this.typeFilter || c.getSpecificType() === this.typeFilter);
  }

  sortClothes(clothes: ClothesStock[]): ClothesStock[] {
    return clothes.sort((a, b) => {
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

  setSortOrder(order: 'name' | 'price' | 'price-desc') {
    this.sortOrder = order;
    this.applyFilters();
  }

  getSizesForProduct(code: string): string[] {
    return this.clothes
      .filter(item => item.getCode() === code)
      .map(item => item.getSize());
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
        this.typeFilter = '';
        break;
      case 'sortOrder':
        this.sortOrder = null;
        break;
    }
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
}
