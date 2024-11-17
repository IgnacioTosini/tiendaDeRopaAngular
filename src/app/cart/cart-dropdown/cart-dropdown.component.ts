import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ClothesStock } from '../../models/clothesStock.model';
import { slideDownUp } from '../../shared/animations/animation';
import { SkeletonService } from '../../services/skeleton-service.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [],
  animations: [slideDownUp],
  templateUrl: './cart-dropdown.component.html',
  styleUrl: './cart-dropdown.component.scss'
})
export class CartDropdownComponent implements OnInit {
  @Input() cartItems: { product: ClothesStock, quantity: number }[] = [];
  @Input() isLogging: Boolean = false;
  isCartDropdownVisible = false;
  isLoading: boolean = true;
  skeletonItems: number[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private skeletonService: SkeletonService,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit() {
    this.skeletonItems = this.skeletonService.generateSkeletonItems(this.cartItems.length || 3);
    this.cartService.getItems().subscribe(items => {
      this.cartItems = items;
      this.isLoading = false;
    });
    this.titleService.setTitle('Shopping Cart - Clothing Store');
    this.metaService.addTags([
      { name: 'description', content: 'Check and manage the products in your shopping cart at our clothing store. Find the latest fashion trends and shop your favorite clothes.' },
      { name: 'keywords', content: 'shopping cart, clothing store, fashion, buy clothes, latest trends, online shopping' }
    ]);
  }

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
