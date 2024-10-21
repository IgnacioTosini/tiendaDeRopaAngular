import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';
import { ImageWrapperComponent } from '../image-wrapper/image-wrapper.component';

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
}
