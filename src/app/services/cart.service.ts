import { ClothesStockService } from './clothes-stock.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Clothes } from '../models/clothes.model';
import { of } from 'rxjs';
import { ClothesStock } from '../models/clothesStock.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: { product: ClothesStock, quantity: number }[] = [];
  private totalPrice: number = 0;
  private userId: number = 0;

  constructor(private localStorageService: LocalStorageService, private userService: UserService, private clothesStockService: ClothesStockService) { }

  addToCart(product: ClothesStock, quantity: number, size: string | null) {
    size = size ?? ''; // Provide a default value for size if it is null
    // Create a copy of the product with the correct size
    let productCopy = new ClothesStock(
      product.getId(),
      product.getName(),
      product.getPrice(),
      product.getCode(),
      size,
      product.getImages(),
      product.getDescription(),
      product.getGenericType(),
      product.getSpecificType(),
      product.getPublicationDate(),
      product.getStock(),
      product.getComments()
    );
    let item = this.items.find(i => i.product.getCode() === productCopy.getCode() && i.product.getSize() === size);
    if (item) {
      // Update the quantity
      item.quantity = quantity;
    } else {
      // Add the specific product with the selected size
      this.items.push({ product: productCopy, quantity });
    }
    this.saveCart();
  }

  loadUser(email: string) {
    this.userService.getUserByEmail(email, '').subscribe(user => {
      (user);
      this.userId = user.getId();
      (this.userId);
      this.loadCart();
    });
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let item of this.items) {
      totalPrice += item.quantity * item.product.getPrice();
    }
    return totalPrice;
  }

  getTotalPriceForProduct(product: ClothesStock, quantity: number) {
    return product.getPrice() * quantity;
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
    this.saveCart();
  }

  clearCart() {
    this.items.splice(0, this.items.length);
    this.saveCart();
  }

  saveCart() {
    this.userId = this.userService.usersArray[0].getId();
    let simpleItems = this.items.map(item => ({
      productId: item.product.getId(),
      quantity: item.quantity,
      size: item.product.getSize(),
      productCode: item.product.getCode(),
    }));

    this.localStorageService.setItem(`cart-${this.userId}`, JSON.stringify(simpleItems));
  }

  loadCart() {
    const storedCart = this.localStorageService.getItem(`cart-${this.userId}`);
    if (storedCart) {
      let itemsJson = JSON.parse(storedCart);
      for (let item of itemsJson) {
        this.clothesStockService.findByCode(item.productCode).subscribe(clothes => {
          let product = clothes[0];
          this.items.push({ product: product, quantity: item.quantity });
        });
      }
    }
  }
}
