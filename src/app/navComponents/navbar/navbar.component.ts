import { AuthService } from '../../services/auth.service';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { ClothesStock } from '../../models/clothesStock.model';
import { User } from '../../models/user.model';
import { slideDownUp } from '../../shared/animations/animation';
import { CartDropdownComponent } from '../../cart/cart-dropdown/cart-dropdown.component';
import { SearchComponent } from '../search/search.component';
import { DropDownMenuProductsComponent } from '../drop-down-menu-products/drop-down-menu-products.component';
import { SearchService } from '../../services/search.service';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, SearchComponent, CartDropdownComponent, DropDownMenuProductsComponent],
  animations: [slideDownUp],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartItems: { product: ClothesStock, quantity: number }[] = [];
  user: User = new User(0, '', '', '', '', '', [], [], '');
  searchQuery: string = '';
  clothes: ClothesStock[] = [];
  searchResults: ClothesStock[] = [];
  groupedClothes: { [genericType: string]: string[] } = {};
  isUserDropdownVisible = false;

  constructor(
    protected cartService: CartService,
    private clothesStockService: ClothesStockService,
    private authService: AuthService,
    private searchService: SearchService,
    private titleService: Title,
    private metaService: Meta,
    private sharedDataService: SharedDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
      console.log(this.clothes);

      // Group clothes by genericType and specificType
      this.groupedClothes = this.groupByTypes(this.clothes);
      this.sharedDataService.setGroupedClothes(this.groupedClothes); // Actualiza el servicio compartido
    } catch (error) {
      console.error('Error loading clothes:', error);
    }

    // Set the title and meta tags for SEO
    this.titleService.setTitle('Online Clothing Store - Navbar');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.metaService.addTags([
      { name: 'description', content: 'Explore our wide range of clothing items and accessories. Shop now and enjoy great deals!' },
      { name: 'keywords', content: 'clothing, online store, fashion, accessories, shop' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
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
