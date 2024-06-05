import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './image-wrapper.component.html',
  styleUrl: './image-wrapper.component.scss'
})
export class ImageWrapperComponent {
  @Input() clothe: ClothesStock = new ClothesStock('', '', 0, '', '', [], '', '', '', '', 0);
  @Output() changeImage = new EventEmitter<number>();
  @Output() setActiveImage = new EventEmitter<number>();
  isFavorite: boolean = false;

  constructor(private router: Router) { }

  onPrevClick() {
    this.changeImage.emit(-1);
  }

  onNextClick() {
    this.changeImage.emit(1);
  }

  onDotClick(index: number) {
    this.setActiveImage.emit(index);
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]);
  }

  toggleFavorite(clothe: ClothesStock) {
    this.isFavorite = !this.isFavorite;
    /* clothe.isFavorite = !clothe.isFavorite; */
    // Aquí puedes agregar más lógica, como actualizar la base de datos o el almacenamiento local del navegador.
  }
}
