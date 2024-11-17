import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { ClothesStock } from '../../models/clothesStock.model';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { slideDownUp } from '../../shared/animations/animation';
import { CartDropdownComponent } from '../../cart/cart-dropdown/cart-dropdown.component';
import { SearchComponent } from '../search/search.component';
import { DropDownMenuProductsComponent } from '../drop-down-menu-products/drop-down-menu-products.component';
import { SearchService } from '../../services/search.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, SearchComponent, CartDropdownComponent, DropDownMenuProductsComponent],
  animations: [slideDownUp],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  cartItems: { product: ClothesStock, quantity: number }[] = [];
  user: User = new User(0, '', '', '', '', '', [], [], '');
  searchQuery: string = '';
  clothes: ClothesStock[] = [];
  searchResults: ClothesStock[] = [];
  groupedClothes: { [genericType: string]: string[] } = {};
  isUserDropdownVisible = false;

  constructor(protected cartService: CartService, private clothesStockService: ClothesStockService, private authService: AuthService, private router: Router, private searchService: SearchService, private titleService: Title, private metaService: Meta) { }

    async ngOnInit() {
      try {
        this.user = await this.authService.UserData;
        this.authService.isLoggedIn = this.authService.UserLogged;
        this.authService.isAdmin();

        if (this.authService.isLoggedIn !== false) {
          this.cartItems = [];

          // Load user and cart
          this.cartService.loadUser(this.user.getEmail());

          // Subscribe to cart items
          this.cartService.getItems().subscribe(items => {
            this.cartItems = items;
          });
        }
      } catch (error) {
        console.info('Error getting user data:', error);
      }

      try {
        const response = await this.clothesStockService.findAll(0, 10).toPromise();
        this.clothes = response?.clothes || [];

        // Group clothes by genericType and specificType
        this.groupedClothes = this.groupByTypes(this.clothes);
      } catch (error) {
        console.error('Error loading clothes:', error);
      }

      // Set the title and meta tags for SEO
      this.titleService.setTitle('Online Clothing Store - Navbar');
      this.metaService.addTags([
        { name: 'description', content: 'Explore our wide range of clothing items and accessories. Shop now and enjoy great deals!' },
        { name: 'keywords', content: 'clothing, online store, fashion, accessories, shop' },
        { name: 'robots', content: 'index, follow' }
      ]);
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
    return this.authService.isLoggedIn;
  }

  get isAdminIn(): Boolean {
    return this.authService.isAdminIn;
  }
  logOut() {
    this.authService.logOut();
  }

  async searchClothes(query: string) {
    this.searchResults = await this.searchService.searchClothes(query);
  }

  showUserDropdown() {
    this.isUserDropdownVisible = true;
  }

  hideUserDropdown() {
    this.isUserDropdownVisible = false;
  }
}
