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

  constructor(private localStorageService: LocalStorageService) { }

  addToCart(product: ClothesStock, quantity: number, size: string) {
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
    );
    let item = this.items.find(i => i.product.getCode() === productCopy.getCode() && i.product.getSize() === size);
    if (item) {
      // Update the quantity
      item.quantity = quantity;
    } else {
      // Add the specific product with the selected size
      this.items.push({ product: productCopy, quantity });
    }
    console.log('items',this.items);
    this.saveCart();
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
    this.localStorageService.setItem('cart', JSON.stringify(this.items));
  }

  loadCart() {
    const storedCart = this.localStorageService.getItem('cart');
    if (storedCart) {
      let itemsJson = JSON.parse(storedCart);
      console.log('jsonItems',itemsJson);
      for (let item of itemsJson) {
        let product = new ClothesStock('', '', 0, '', '', [], '', '', '', '', 0);
        product.setId(item.product.id);
        product.setName(item.product.name);
        product.setPrice(item.product.price);
        product.setCode(item.product.code);
        product.setSize(item.product.size);
        product.setDescription(item.product.description);
        product.setGenericType(item.product.genericType);
        product.setSpecificType(item.product.specificType);
        product.setPublicationDate(item.product.publication);
        product.setImages(item.product.images);
        product.setStock(item.product.stock);
        this.items.push({ product: product, quantity: item.quantity });
        console.log('items cargados',this.items);
      }
    }
  }
}
