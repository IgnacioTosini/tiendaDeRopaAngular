import { Component, Input } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './cart-dropdown.component.html',
  styleUrl: './cart-dropdown.component.scss'
})
export class CartDropdownComponent {
  @Input() cartItems: { product: ClothesStock, quantity: number }[] = [];
  @Input() isLogging: Boolean = false;

  constructor(private cartService: CartService, private router: Router) { }

  getTotalPriceForProduct(product: ClothesStock, quantity: number): string {
    const totalPrice = this.cartService.getTotalPriceForProduct(product, quantity);
    return totalPrice.toFixed(2);
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]);
  }

  removeItem(item: { product: ClothesStock }) {
    this.cartService.removeFromCart(item.product);
  }
}
