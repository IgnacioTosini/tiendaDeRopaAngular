import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClothesStock } from '../models/clothesStock.model';
import { CreateClotheComponent } from '../create-clothe/create-clothe.component';
import { FiltersComponent } from '../filters/filters.component';
import { ClothesListComponent } from '../clothes-list/clothes-list.component';
import { ClothesGalleryComponent } from '../clothes-gallery/clothes-gallery.component';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOutLeft, zoomInOut, fadeScaleInOut } from '../shared/animations/animation';
import { InvoiceComponent } from "../invoice/invoice.component";
import { UserFilterFormComponent } from '../user-filter-form/user-filter-form.component';
import { UserListComponent } from '../user-list/user-list.component';
import { SharedService } from './../services/shared.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CreateClotheComponent, FiltersComponent, ClothesListComponent, ClothesGalleryComponent, InvoiceComponent, UserFilterFormComponent, UserListComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [slideInOutLeft, zoomInOut, fadeScaleInOut]
})
export class AdminComponent implements AfterViewInit {
  @ViewChild(FiltersComponent) filtersComponent!: FiltersComponent;

  typeFilter: string = '';
  selectedClothes: ClothesStock | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedService) { }

  async ngAfterViewInit() {
    this.route.params.subscribe((params: any) => {
      this.typeFilter = params['type'];
      setTimeout(() => {
        if (this.filtersComponent) {
          this.applyFilters();
        } else {
          console.error('filtersComponent is not initialized');
        }
      }, 0);
    });
  }

  applyFilters() {
    this.filtersComponent.applyFilters();
  }

  onProductSelected(clothe: ClothesStock) {
    this.selectedClothes = clothe;
    this.sharedService.setSelectedClothes(clothe);
    this.router.navigate(['/modifyProductPage']);
  }
}
