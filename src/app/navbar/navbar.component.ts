import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Clothes } from '../models/clothes.model';
import { FormsModule } from '@angular/forms';
import { ClothesStockService } from '../services/clothes-stock.service';
import { ClothesStock } from '../models/clothesStock.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  cartItems: { product: Clothes, quantity: number }[] = [];
  showSubMenu: boolean = true;
  searchQuery: string = '';
  clothes: ClothesStock[] = []; // Modificado para ser un arreglo de Clothes
  searchResults: Clothes[] = [];
  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(protected cartService: CartService, private clothesStockService: ClothesStockService, private AuthService: AuthService) { } // Inyectamos ClothesStockService

  async ngOnInit() {
    this.cartService.getItems().subscribe(items => {
      this.cartItems = items;
    });

    await this.clothesStockService.findAll().toPromise();
    this.clothes = this.clothesStockService.clothesArray;
    this.subscription = this.AuthService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.AuthService.logOut();
  }

  removeItem(item: { product: Clothes }) {
    this.cartService.removeFromCart(item.product);
  }

  searchClothes() {
    if (this.searchQuery) {
      this.searchResults = this.clothes.filter(clothesItem =>
        clothesItem.getName().toLowerCase().includes(this.searchQuery.toLowerCase()) // Modificado para usar la propiedad name en lugar del método getName
      );
    } else {
      this.searchResults = [];
    }
  }
}
