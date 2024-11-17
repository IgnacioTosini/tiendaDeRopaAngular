import { NavigationService } from '../../services/navigation-service.service';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { Component, OnInit } from '@angular/core';
import { ClothesStock } from '../../models/clothesStock.model';
import { Meta, Title } from '@angular/platform-browser';
import { ClotheItemComponent } from '../../clothe/clothe-item/clothe-item.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ClotheItemComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  clothes: (ClothesStock | null)[] = [null, null, null]; // Inicializar con skeletons
  selectedClothe: ClothesStock | null = null;

  constructor(
    private clothesStockService: ClothesStockService,
    private navigationService: NavigationService,
    private meta: Meta,
    private title: Title
  ) { }

  async ngOnInit() {
    const response = await this.clothesStockService.findAll(0, 3).toPromise();
    this.clothes = response ? response.clothes : [];
    for (let i = this.clothes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.clothes[i], this.clothes[j]] = [this.clothes[j], this.clothes[i]];
    }
    this.clothes = this.clothes.slice(0, 3);
    this.clothes.forEach(clothe => {
      if (clothe) {
        clothe.currentImage = 0;
      }
    });

    this.title.setTitle('Gallery - Tienda de Ropa');
    this.meta.addTags([
      { name: 'description', content: 'Explore our latest collection of clothes in the gallery.' },
      { name: 'keywords', content: 'clothes, fashion, gallery, tienda de ropa' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }

  goToProduct(clothe: ClothesStock) {
    this.selectedClothe = this.navigationService.goToProductAdminMode(clothe, false, this.selectedClothe);
  }

  changeImage(index: number, change: number) {
    const clothe = this.clothes[index];
    if (clothe) {
      const imagesCount = clothe.getImages().length;
      clothe.currentImage = (clothe.currentImage + change + imagesCount) % imagesCount;
    }
  }

  setActiveImage(index: number, imageIndex: number) {
    const clothe = this.clothes[index];
    if (clothe) {
      clothe.currentImage = imageIndex;
    }
  }
}
