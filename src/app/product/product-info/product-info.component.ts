import { Component, EventEmitter, Input, Output, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToCartComponent } from '../../cart/add-to-cart/add-to-cart.component';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, AddToCartComponent],
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent {
  @Input() product: any;
  @Input() sizesAvailable: string[] = [];
  @Input() sizeQuantities: { [key: string]: number } = {};
  @Input() selectedSize: string = '';
  @Input() quantity: number = 1;
  @Output() sizeSelect = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<void>();

  constructor(private meta: Meta, private title: Title, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.title.setTitle(this.product?.getName() || 'Product Info');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: this.product?.getDescription() || 'Product description' },
      { name: 'keywords', content: 'clothing, fashion, buy clothes, online store' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }

  selectSize(size: string) {
    this.sizeSelect.emit(size);
  }

  updateQuantity(newQuantity: number) {
    this.quantityChange.emit(newQuantity);
  }

  addProductToCart() {
    this.addToCart.emit();
  }
}
