import { Component, Input } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { slideDownUp } from '../shared/animations/animation';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [],
  animations: [ slideDownUp ],
  templateUrl: './cart-dropdown.component.html',
  styleUrl: './cart-dropdown.component.scss'
})
export class CartDropdownComponent {
  @Input() cartItems: { product: ClothesStock, quantity: number }[] = [];
  @Input() isLogging: Boolean = false;
  isCartDropdownVisible = false;

  constructor(private cartService: CartService, private router: Router) { }

  getTotalPriceForProduct(product: ClothesStock, quantity: number): string {
    const totalPrice = this.cartService.getTotalPriceForProduct(product, quantity);
    return totalPrice.toFixed(2);
  }

  viewProduct(clothe: ClothesStock): void {
    this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  removeItem(item: { product: ClothesStock }) {
    this.cartService.removeFromCart(item.product);
  }

  showCartDropdown() {
    this.isCartDropdownVisible = true;
  }

  hideCartDropdown() {
    this.isCartDropdownVisible = false;
  }
}
