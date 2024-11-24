import { Component, EventEmitter, Input, Output, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart-actions',
  standalone: true,
  imports: [],
  templateUrl: './cart-actions.component.html',
  styleUrls: ['./cart-actions.component.scss']
})
export class CartActionsComponent {
  @Input() totalPrice: number = 0;
  @Input() showSubmenu: boolean = false;
  @Input() userId: number = 0;
  @Output() clearCart = new EventEmitter<void>();
  @Output() toggleSubmenu = new EventEmitter<void>();
  @Output() payInCash = new EventEmitter<void>();
  @Output() payWithMercadoPago = new EventEmitter<void>();

  constructor(private meta: Meta, private title: Title, @Inject(PLATFORM_ID) private platformId: Object) {
    this.title.setTitle('Cart Actions - Online Clothing Store');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Manage your cart actions including clearing the cart and making payments.' },
      { name: 'keywords', content: 'cart, actions, online store, clothing, payments' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }

  clear() {
    this.clearCart.emit();
  }

  toggle() {
    this.toggleSubmenu.emit();
  }

  payCash() {
    this.payInCash.emit();
  }

  payMercadoPago() {
    this.payWithMercadoPago.emit();
  }
}
