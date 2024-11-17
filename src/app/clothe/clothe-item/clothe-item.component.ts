import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClothesStock } from '../../models/clothesStock.model';
import { ImageWrapperComponent } from '../../img/image-wrapper/image-wrapper.component';

@Component({
  selector: 'app-clothe-item',
  standalone: true,
  imports: [ImageWrapperComponent],
  templateUrl: './clothe-item.component.html',
  styleUrls: ['./clothe-item.component.scss']
})
export class ClotheItemComponent {
  @Input() clothe!: ClothesStock;
  @Input() isAdminMode: boolean = false;
  @Input() showSubMenu: boolean = false;
  @Input() selectedClothe: ClothesStock | null = null;
  @Output() displayShowSubMenu = new EventEmitter<ClothesStock>();
  @Output() changeImage = new EventEmitter<{ index: number, change: number }>();
  @Output() setActiveImage = new EventEmitter<{ index: number, imageIndex: number }>();
  @Output() goToProduct = new EventEmitter<ClothesStock>();
  @Output() viewProduct = new EventEmitter<ClothesStock>();
  @Output() modifyProduct = new EventEmitter<ClothesStock>();

  getSizesForProduct(): string {
    return this.clothe.getSize();
  }

  getAriaLabel(): string {
    return `${this.clothe.getName()}, Size: ${this.getSizesForProduct()}, Price: $${this.clothe.getPrice()}`;
  }

  getStructuredData(): string {
    return JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": this.clothe.getName(),
      "image": this.clothe.getImages(),
      "description": this.clothe.getDescription(),
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": this.clothe.getPrice(),
        "availability": "https://schema.org/InStock"
      }
    });
  }
}
