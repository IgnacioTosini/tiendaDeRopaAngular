import { NavigationService } from './../services/navigation-service.service';
import { ClothesStockService } from './../services/clothes-stock.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClothesStock } from '../models/clothesStock.model';
import { ClotheItemComponent } from '../clothe-item/clothe-item.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ClotheItemComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  clothes: ClothesStock[] = [];
  selectedClothe: ClothesStock | null = null;

  constructor(private router: Router, private ClothesStockService: ClothesStockService, private navigationService: NavigationService) { }

  async ngOnInit() {
    await this.ClothesStockService.findAll(0, 3).toPromise();
    this.clothes = this.ClothesStockService.clothesArray;
    for (let i = this.clothes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.clothes[i], this.clothes[j]] = [this.clothes[j], this.clothes[i]];
    }
    this.clothes = this.clothes.slice(0, 3);
    this.clothes.forEach(clothe => clothe.currentImage = 0);
  }

  goToProduct(clothe: ClothesStock) {
    this.selectedClothe = this.navigationService.goToProductAdminMode(clothe, false, this.selectedClothe);
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
