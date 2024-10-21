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
  @Output() closeModal = new EventEmitter<void>();

  currentIndex: number = 0;

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
}
