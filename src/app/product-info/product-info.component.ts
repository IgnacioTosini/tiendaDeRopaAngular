import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, AddToCartComponent],
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent {
  @Input() product: any;
  @Input() sizesAvailable: string[] = [];
  @Input() sizeQuantities: { [key: string]: number } = {}; // Añadido para recibir las cantidades de cada tamaño
  @Input() selectedSize: string = '';
  @Input() quantity: number = 1;
  @Output() sizeSelect = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<void>();

  selectSize(size: string) {
    this.sizeSelect.emit(size);
  }

  updateQuantity(newQuantity: number) {
    this.quantityChange.emit(newQuantity);
  }

  addProductToCart() {
    this.addToCart.emit();
  }
}
