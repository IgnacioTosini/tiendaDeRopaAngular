import { ClothesStockService } from './../services/clothes-stock.service';
import { Component, HostListener, Input } from '@angular/core';
import { Clothes } from '../models/clothes.model';
import { ClothesStock } from '../models/clothesStock.model';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  clothes: ClothesStock[] = []; // Modificado para ser un arreglo de Clothes
  currentImageIndex = 0;
  startX!: number;
  isDragging = false;

  constructor(private ClothesStockService: ClothesStockService) { }

  async ngOnInit() {
    await this.ClothesStockService.findAll().toPromise();
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
}
