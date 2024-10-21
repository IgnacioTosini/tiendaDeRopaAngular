import { ClothesStockService } from './../services/clothes-stock.service';
import { Component, HostListener } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  clothes: ClothesStock[] = [];
  currentImageIndex = 0;
  startX!: number;
  isDragging = false;
  selectedClothe: ClothesStock | null = null;

  constructor(private ClothesStockService: ClothesStockService, private router: Router) { }

  async ngOnInit() {
    await this.ClothesStockService.findAll(0, 5).toPromise();
    this.clothes = this.ClothesStockService.clothesArray;
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.clothes.length;
  }

  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.clothes.length) % this.clothes.length;
  }

  handleImageClick(index: number) {
    this.currentImageIndex = index;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
    this.isDragging = true;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) {
      return;
    }

    const x = event.clientX;
    const diff = this.startX - x;

    if (diff > 0) {
      this.nextImage();
    } else if (diff < 0) {
      this.previousImage();
    }

    this.isDragging = false;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]).then(() => {
      window.location.reload();
      setTimeout(() => {
        window.scrollTo(0, 0); // Desplazar hacia la parte superior de la página
      }, 0);
    });
  }
}
