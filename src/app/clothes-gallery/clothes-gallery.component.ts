import { ClothesStockService } from './../services/clothes-stock.service';
import { Component } from '@angular/core';
import { Clothes } from '../models/clothes.model';
import { FormsModule } from '@angular/forms';
import { ClothesStock } from '../models/clothesStock.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageWrapperComponent } from '../image-wrapper/image-wrapper.component';

@Component({
  selector: 'app-clothes-gallery',
  standalone: true,
  imports: [FormsModule, ImageWrapperComponent],
  templateUrl: './clothes-gallery.component.html',
  styleUrl: './clothes-gallery.component.scss'
})
export class ClothesGalleryComponent {
  clothes: ClothesStock[] = [];
  filteredClothes: ClothesStock[] = [...this.clothes];
  nameFilter: string = '';
  minPriceFilter: number | null = null;
  maxPriceFilter: number | null = null;
  pageSize: number = 8;
  pageIndex: number = 0;
  sortOrder: 'name' | 'price' | 'price-desc' | null = null;
  typeFilter: string = '';
  types: string[] = [];
  groupedTypes: { [key: string]: string[] } = {};
  genericTypes: string[] = [];

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

    // Convert each array of specific types to a Set and back to an array to remove duplicates
    for (let genericType in this.groupedTypes) {
      this.groupedTypes[genericType] = Array.from(new Set(this.groupedTypes[genericType]));
    }

    this.genericTypes = Object.keys(this.groupedTypes);
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
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
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

  goToProduct(clothe: Clothes) {
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

  setSortOrder(order: 'name' | 'price' | 'price-desc' | null) {
    this.sortOrder = order;
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

  setPriceRange(min: number | null, max: number | null) {
    const maxLength = 5; // set your desired max length here

    if (min !== null && min !== undefined && min.toString().length > maxLength) {
      this.minPriceFilter = Number(min.toString().slice(0, maxLength));
    } else {
      this.minPriceFilter = min;
    }

    if (max !== null && max !== undefined && max.toString().length > maxLength) {
      this.maxPriceFilter = Number(max.toString().slice(0, maxLength));
    } else {
      this.maxPriceFilter = max;
    }

    this.applyFilters();
  }

  resetNameFilter() {
    this.nameFilter = '';
    this.applyFilters();
  }

  resetMinPriceFilter() {
    this.minPriceFilter = null;
    this.applyFilters();
  }

  resetMaxPriceFilter() {
    this.maxPriceFilter = Infinity;
    this.applyFilters();
  }

  resetTypeFilter() {
    this.typeFilter = '';
    this.applyFilters();
  }

  resetSortOrder() {
    this.sortOrder = null;
    this.applyFilters();
  }

  preventNumberInput(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  preventNumberInputCant(event: any) {
    const maxLength = 5;
    let inputField = event.target;

    if (inputField.value.length >= maxLength) {
      // prevent input if max length reached
      event.preventDefault();
    }
  }
}
