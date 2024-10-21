import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() item!: { product: ClothesStock, quantity: number };
  @Output() remove = new EventEmitter<void>();
  @Output() goToProduct = new EventEmitter<void>();

  constructor(private cartService: CartService) { }

  removeItem() {
    this.remove.emit();
  }

  navigateToProduct() {
    this.goToProduct.emit();
  }

  getTotalPriceForProduct(product: ClothesStock, quantity: number): string {
    const totalPrice = this.cartService.getTotalPriceForProduct(product, quantity);
    return totalPrice.toFixed(2);
  }
}
