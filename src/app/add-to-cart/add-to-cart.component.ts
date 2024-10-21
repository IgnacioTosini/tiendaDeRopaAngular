import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [],
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent {
  @Input() quantity: number = 1;
  @Input() selectedSize: string = '';
  @Input() product: any;
  @Input() sizeQuantities: { [key: string]: number } = {}; // Añadido para recibir las cantidades de cada tamaño
  @Output() quantityChange = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<void>();

  subtractQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  sumAmount() {
    const maxQuantity = this.sizeQuantities[this.selectedSize] || 0;
    if (this.quantity < maxQuantity) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  addProductToCart() {
    this.addToCart.emit();
  }
}
