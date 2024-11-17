import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss'
})
export class ProductGalleryComponent {
  @Input() smallImages: string[] = [];
  @Input() mainImage: string = '';
  @Input() productName: string = '';
  @Input() altText: string = '';
  @Input() imageDescriptions: string[] = [];
  @Input() isLoadingImages: boolean = true;
  @Output() imageChange = new EventEmitter<string>();
  @Output() openModal = new EventEmitter<void>();

  changeMainImage(image: string) {
    this.imageChange.emit(image);
  }

  openImageModal() {
    this.openModal.emit();
  }
}
