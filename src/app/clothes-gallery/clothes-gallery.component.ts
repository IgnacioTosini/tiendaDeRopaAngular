import { Component, ViewChild, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { ClothesStockService } from './../services/clothes-stock.service';
import { ClothesStock } from '../models/clothesStock.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FiltersComponent } from '../filters/filters.component';
import { ActiveFiltersComponent } from '../active-filters/active-filters.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { ClotheItemComponent } from '../clothe-item/clothe-item.component';
import { Pagination } from '../models/pagination.model';

@Component({
  selector: 'app-clothes-gallery',
  standalone: true,
  imports: [FormsModule, FiltersComponent, ActiveFiltersComponent, PaginationComponent, ToastNotificationComponent, ClotheItemComponent],
  templateUrl: './clothes-gallery.component.html',
  styleUrls: ['./clothes-gallery.component.scss']
})
export class ClothesGalleryComponent implements OnInit {
  @ViewChild(FiltersComponent) filtersComponent!: FiltersComponent;
  @Input() isAdminMode: boolean = false;
  @Output() productSelected = new EventEmitter<ClothesStock>();

  clothes: ClothesStock[] = [];
  filteredClothes: ClothesStock[] = [];
  nameFilter: string = '';
  minPriceFilter: number | null = null;
  maxPriceFilter: number | null = null;
  sortOrder: 'name' | 'price' | 'price-desc' | null = null;
  typeFilter: string = '';
  groupedTypes: { [key: string]: string[] } = {};
  genericTypes: string[] = [];
  currentPage: number = 0;
  pageSize: number = 8;
  pagination: Pagination | null = null;
  selectedClothe: ClothesStock | null = null;
  showSubMenu: boolean = false;

  @ViewChild('gallery') gallery!: ElementRef;

  constructor(private clothesStockService: ClothesStockService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    await this.loadClothes();
    this.route.params.subscribe(params => {
      this.typeFilter = params['type'] || 'Todas las Categorias';
      this.applyFilters();
    });
    this.filtersComponent.filtersChanged.subscribe(() => this.handleFiltersChanged());
  }

  async loadClothes(page: number = 0) {
    try {
      const response = await this.clothesStockService.findAll(page, this.pageSize).toPromise();
      if (response) {
        this.clothes = this.groupClothesByCode(response.clothes);
        this.pagination = response.pagination;
      }
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
    } catch (error) {
      console.error('Error loading clothes:', error);
    }
  }

  groupClothesByCode(clothes: ClothesStock[]): ClothesStock[] {
    const grouped: { [key: string]: ClothesStock } = {};

    clothes.forEach(clothe => {
      const code = clothe.getCode();
      if (!grouped[code]) {
        grouped[code] = clothe;
      } else {
        const existingClothe = grouped[code];
        const newSize = clothe.getSize();
        const existingSizes = existingClothe.getSize().split(', ');
        if (!existingSizes.includes(newSize)) {
          existingClothe.setSize(existingSizes.concat(newSize).join(', '));
        }
      }
    });

    return Object.values(grouped);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadClothes(page);
  }

  applyFilters() {
    this.filtersComponent.typeFilter = this.typeFilter;
    this.filtersComponent.applyFilters();
  }

  handleFilteredClothes(filtered: ClothesStock[]) {
    this.filteredClothes = filtered;
  }

  setSortOrder(order: 'name' | 'price' | 'price-desc') {
    this.sortOrder = order;
    this.filtersComponent.setSortOrder(order);
  }

  goToProduct(clothe: ClothesStock) {
    if (this.isAdminMode) {
      this.selectedClothe = this.selectedClothe === clothe ? null : clothe;
    } else {
      this.router.navigate(['/product', clothe.getCode()]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  viewProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  modifyProduct(clothe: ClothesStock) {
    console.log(clothe);
    this.productSelected.emit(clothe);
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

  handleFiltersChanged() {
    this.nameFilter = this.filtersComponent.nameFilter;
    this.minPriceFilter = this.filtersComponent.minPriceFilter;
    this.maxPriceFilter = this.filtersComponent.maxPriceFilter;
    this.typeFilter = this.filtersComponent.typeFilter;
  }

  displayShowSubMenu(clothe: ClothesStock) {
    if (this.selectedClothe === clothe) {
      this.showSubMenu = !this.showSubMenu;
    } else {
      this.selectedClothe = clothe;
      this.showSubMenu = true;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.clothe-item')) {
      this.showSubMenu = false;
      this.selectedClothe = null;
    }
  }
}
