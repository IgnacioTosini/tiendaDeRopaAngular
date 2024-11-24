import { Component, EventEmitter, Input, Output, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [],
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent {
  @Input() quantity: number = 1;
  @Input() selectedSize: string = '';
  @Input() product: any;
  @Input() sizeQuantities: { [key: string]: number } = {};
  @Output() quantityChange = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<void>();

  constructor(private meta: Meta, private title: Title, @Inject(PLATFORM_ID) private platformId: Object) {
    this.title.setTitle('Add to Cart - Your Online Clothing Store');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Add your favorite clothing items to your cart. Choose the size and quantity you need. Shop the latest fashion trends at our online store.' },
      { name: 'keywords', content: 'clothing, online store, add to cart, fashion, shopping, buy clothes, latest trends, apparel, e-commerce' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }

  subtractQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  sumAmount() {
    const maxQuantity = this.sizeQuantities[this.selectedSize] || 0;
    if (this.quantity < maxQuantity) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  addProductToCart() {
    this.addToCart.emit();
  }
}
