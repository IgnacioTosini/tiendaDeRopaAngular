import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Add to Cart - Your Online Clothing Store');
    this.meta.addTags([
      { name: 'description', content: 'Add your favorite clothing items to your cart. Choose the size and quantity you need. Shop the latest fashion trends at our online store.' },
      { name: 'keywords', content: 'clothing, online store, add to cart, fashion, shopping, buy clothes, latest trends, apparel, e-commerce' }
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
