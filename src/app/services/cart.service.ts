import { Injectable } from '@angular/core';
import { Clothes } from '../models/clothes.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: { product: Clothes, quantity: number }[] = [];
  private totalPrice: number = 0;

  addToCart(product: Clothes, quantity: number) {
    const item = this.items.find(i => i.product === product);
    if (item) {
      // Subtract the old total price for this item
      this.totalPrice -= item.quantity * product.getPrice();
      // Update the quantity
      item.quantity = quantity;
      // Add the new total price for this item
      this.totalPrice += item.quantity * product.getPrice();
    } else {
      this.items.push({ product, quantity });
      // Add the new total price for this item
      this.totalPrice += quantity * product.getPrice();
    }
  }
  getTotalPrice() {
    return this.totalPrice;
  }

  getItems() {
    return of(this.items);
  }

removeFromCart(product: Clothes) {
  const index = this.items.findIndex(i => i.product === product);
  if (index > -1) {
    // Subtract the total price for this item
    this.totalPrice -= this.items[index].quantity * product.getPrice();
    // Remove the item from the array
    this.items.splice(index, 1);
  }
}
}
