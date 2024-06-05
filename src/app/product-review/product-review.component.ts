import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.scss'
})
export class ProductReviewComponent {
  @Input() reviews: any[] = [];
  @Output() reviewAdded = new EventEmitter<string>();

  addReview(review: string) {
    this.reviewAdded.emit(review);
  }
}
