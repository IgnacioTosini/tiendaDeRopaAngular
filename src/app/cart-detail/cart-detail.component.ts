import { LocalStorageService } from './../services/local-storage.service';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ClothesStock } from '../models/clothesStock.model';
import { Router } from '@angular/router';
import { Tax } from '../models/tax.model';
import { TaxService } from '../services/tax.service';
import { User } from '../models/user.model';
import { ClothesSold } from '../models/clothesSold.model';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss'
})
export class CartDetailComponent {
  cartItems: { product: ClothesStock, quantity: number }[] = [];
  user: User = new User(0, '', '', '', '', '', [], [], '');

  constructor(public cartService: CartService, private router: Router, private taxService: TaxService, private authService: AuthService, private localStorageService: LocalStorageService) {
    this.cartService.getItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  async ngOnInit() {
    this.user = await this.authService.UserData;
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]);
  }

  removeItem(item: { product: ClothesStock }) {
    this.cartService.removeFromCart(item.product);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getTotalPriceForProduct(product: ClothesStock, quantity: number): string {
    const totalPrice = this.cartService.getTotalPriceForProduct(product, quantity);
    return totalPrice.toFixed(2);
  }

  async getAllTaxes() {
    let allTaxes;
    try {
      allTaxes = await this.taxService.findAll().toPromise();
    } catch (error) {
      console.error('Error al obtener todas las facturas:', error);
      allTaxes = [];
    }
    console.log('Todas las facturas:', allTaxes);
    return allTaxes;
  }

  getNewId(allTaxes: Tax[]): string {
    let newId;
    if (allTaxes.length === 0) {
      newId = 0;
    } else {
      const maxId = Math.max(...allTaxes.map((tax: Tax) => Number(tax.getId())));
      newId = maxId + 1;
    }
    newId = newId.toString();
    return newId;
  }

  generateRandomCode() {
    let randomCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    for (let i = 0; i < 5; i++) {
      randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    for (let i = 0; i < 2; i++) {
      randomCode += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return randomCode;
  }

  createClothesSoldItems() {
    return this.cartItems.map(item => {
      const product = item.product;
      return new ClothesSold(
        product.getId(),
        product.getName(),
        product.getPrice(),
        product.getCode(),
        product.getSize(),
        product.getDescription(),
        product.getGenericType(),
        product.getSpecificType(),
        product.getPublicationDate(),
        item.quantity
      );
    });
  }

  createTax(newId: string, randomCode: string, clothesSoldItems: ClothesSold[]) {
    let date = new Date();
    let formattedDate = date.toISOString().slice(0, 10);
    return new Tax(
      newId, // id
      this.cartService.getTotalPrice(), // price
      randomCode, // code
      'lpm', // adress
      1000, // traverCost
      formattedDate, // date
      clothesSoldItems // clothes
    );
  }

  async confirmPurchase() {
    const allTaxes = await this.getAllTaxes();
    const newId = this.getNewId(allTaxes);
    const randomCode = this.generateRandomCode();
    const clothesSoldItems = this.createClothesSoldItems();
    console.log('Items vendidos:', clothesSoldItems);
    const tax = this.createTax(newId, randomCode, clothesSoldItems);
    console.log('Factura a guardar:', tax);

    // Guardar la factura en el backend
    this.taxService.create(this.user.getId(), tax).subscribe({
      next: () => {
        console.log('Factura creada:', tax);
        this.localStorageService.setItem('invoiceCode', JSON.stringify(randomCode));
        console.log('Código de factura guardado:', randomCode);

        // Navega al componente de factura después de confirmar la compra
        this.router.navigate(['/invoice']);

        // Limpia el carrito
        this.clearCart();
      },
      error: (err) => {
        console.error('Error al crear la factura:', err);
      }
    });
  }
}
