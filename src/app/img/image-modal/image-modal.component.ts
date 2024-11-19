import { ImageService } from './../../services/image.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss'
})
export class ImageModalComponent {
  @Input() mainImage: string = '';
  @Input() smallImages: string[] = [];
  @Input() altTexts: string[] = []; // New input for alt texts
  @Output() closeModal = new EventEmitter<void>();

  currentIndex: number = 0;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.currentIndex = this.smallImages.indexOf(this.mainImage);
  }

  nextImage() {
    if (this.currentIndex < this.smallImages.length - 1) {
      this.currentIndex++;
    }
  }

  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  close() {
    this.closeModal.emit();
  }

  onImageError(event: Event): void {
    this.imageService.handleImageError(event);
  }
}
