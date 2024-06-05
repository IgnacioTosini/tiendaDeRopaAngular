import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';
import { ClothesStockService } from '../services/clothes-stock.service';
import { ClothesStock } from '../models/clothesStock.model';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { SearchComponent } from '../search/search.component';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';
import { DropDownMenuProductsComponent } from '../drop-down-menu-products/drop-down-menu-products.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, SearchComponent, CartDropdownComponent, DropDownMenuProductsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  cartItems: { product: ClothesStock, quantity: number }[] = [];
  user: User = new User('', '', '', '', '', '');
  searchQuery: string = '';
  clothes: ClothesStock[] = [];
  searchResults: ClothesStock[] = [];
  groupedClothes: { [genericType: string]: string[] } = {};

  constructor(protected cartService: CartService, private clothesStockService: ClothesStockService, private AuthService: AuthService, private router: Router) { }

  async ngOnInit() {
    try {
      this.user = await this.AuthService.UserData;
      this.AuthService.isLoggedIn = this.AuthService.UserLogged;
      this.AuthService.isAdminIn = this.AuthService.UserAdmin;
    } catch (error) {
      console.error('Error getting user data:', error);
    }

    if (this.AuthService.isLoggedIn !== false) {
      this.cartItems = [];

      // Subscribe to cart items before loading cart
      this.cartService.getItems().subscribe(items => {
        this.cartItems = items;
      });

      // Load cart from localStorage
      this.cartService.loadCart();
    }

    try {
      const clothes = await this.clothesStockService.findAll().toPromise();
      this.clothes = clothes || [];
    } catch (error) {
      console.error('Error getting clothes:', error);
      this.clothes = [];
    }

    // Group clothes by genericType and specificType
    this.groupedClothes = this.groupByTypes(this.clothes);
  }

  groupByTypes(clothes: ClothesStock[]) {
    const grouped: { [key: string]: string[] } = {};

    clothes.forEach(clothe => {
      const genericType = clothe.getGenericType();
      const specificType = clothe.getSpecificType();

      if (!grouped[genericType]) {
        grouped[genericType] = [];
      }
      if (!grouped[genericType].includes(specificType)) {
        grouped[genericType].push(specificType);
      }
    });

    return grouped;
  }

  get isLogging(): Boolean {
    return this.AuthService.isLoggedIn;
  }

  get isAdminIn(): Boolean {
    return this.AuthService.isAdminIn;
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]);
  }

  logOut() {
    this.AuthService.logOut();
  }

  searchClothes(query: string) {
    this.searchResults = this.clothes.filter(clothesItem =>
      clothesItem.getName().toLowerCase().includes(query.toLowerCase())
    );
  }
}
