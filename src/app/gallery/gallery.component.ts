import { ClothesStockService } from './../services/clothes-stock.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClothesStock } from '../models/clothesStock.model';
import { ImageWrapperComponent } from '../image-wrapper/image-wrapper.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ImageWrapperComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  clothes: ClothesStock[] = [];

  constructor(private router: Router, private ClothesStockService: ClothesStockService) { }

  async ngOnInit() {
    await this.ClothesStockService.findAll().toPromise();
    this.clothes = this.ClothesStockService.clothesArray;
    for (let i = this.clothes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.clothes[i], this.clothes[j]] = [this.clothes[j], this.clothes[i]];
    }
    this.clothes = this.clothes.slice(0, 3);
    this.clothes.forEach(clothe => clothe.currentImage = 0);
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]).then(() => {
      window.location.reload();
      setTimeout(() => {
        window.scrollTo(0, 0); // Desplazar hacia la parte superior de la página
      }, 0);
    });
  }

  changeImage(index: number, change: number) {
    const clothe = this.clothes[index];
    const imagesCount = clothe.getImages().length;

    clothe.currentImage = (clothe.currentImage + change + imagesCount) % imagesCount;
  }

  setActiveImage(index: number, imageIndex: number) {
    this.clothes[index].currentImage = imageIndex;
  }

  getSizesForProduct(code: string): string[] {
    return this.clothes
      .filter(item => item.getCode() === code)
      .map(item => item.getSize());
  }
}
