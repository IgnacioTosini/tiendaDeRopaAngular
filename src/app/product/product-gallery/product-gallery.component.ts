import { ImageService } from './../../services/image.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [],
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss']
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

  constructor(private imageService: ImageService) {}

  changeMainImage(image: string) {
    this.imageChange.emit(image);
  }

  openImageModal() {
    this.openModal.emit();
  }

  onImageError(event: Event): void {
      this.imageService.handleImageError(event);
  }
}
