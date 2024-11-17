import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cart-actions',
  standalone: true,
  imports: [],
  templateUrl: './cart-actions.component.html',
  styleUrl: './cart-actions.component.scss'
})
export class CartActionsComponent {
  @Input() totalPrice: number = 0;
  @Input() showSubmenu: boolean = false;
  @Input() userId: number = 0;
  @Output() clearCart = new EventEmitter<void>();
  @Output() toggleSubmenu = new EventEmitter<void>();
  @Output() payInCash = new EventEmitter<void>();
  @Output() payWithMercadoPago = new EventEmitter<void>();

  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Cart Actions - Online Clothing Store');
    this.meta.addTags([
      { name: 'description', content: 'Manage your cart actions including clearing the cart and making payments.' },
      { name: 'keywords', content: 'cart, actions, online store, clothing, payments' }
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