import { AuthService } from './../services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Comment } from '../models/comment.model';
import { CommentService } from '../services/comment.service';
import { User } from '../models/user.model';
import { ClothesStock } from '../models/clothesStock.model';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [ToastNotificationComponent],
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit, OnChanges {
  @Input() reviews: any[] = [];
  @Input() productId: string = '';
  @Input() userId: number = 0;
  @Output() reviewAdded = new EventEmitter<Comment>();
  @Input() product!: ClothesStock;
  user: User = new User(0, '', '', '', '', '', [], [], '');
  notificationMessage: string = '';

  constructor(private commentService: CommentService, private authService: AuthService) { }

  async ngOnInit() {
    this.user = await this.authService.UserData;
    if (this.user) {
      this.userId = this.user.getId();
      this.productId = this.product.getId();
    }
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && !changes['product'].firstChange) {
      this.productId = this.product.getId();
      this.loadComments();
    }
  }

  loadComments() {
    this.commentService.findComments(this.productId, 0, 10).subscribe({
      next: (comments) => {
        if (comments.length > 0) {
          this.reviews = comments;
        } else {
          this.reviews = [];
        }
      },
      error: () => {
        this.reviews = [];
      }
    });
  }

  addReview(reviewText: string) {
    if (!reviewText) return; // No hacer nada si el texto está vacío

    if (!this.userId || !this.productId) {
      console.error('El usuario o el producto no tienen un ID asignado.');
      this.notificationMessage = 'Necesita estar logueado';
      setTimeout(() => {
        this.notificationMessage = '';
      }, 5000);
      return;
    }

    const newComment = {
      comment: reviewText,
      idUser: this.userId,
      idProduct: this.productId
    };

    this.commentService.addComment(newComment).subscribe({
      next: (comment) => {
        this.reviews.push(comment);
        this.reviewAdded.emit(comment);
        this.loadComments();
      },
      error: (error) => {
        console.error('Error al agregar comentario:', error);
        console.log(error.error);
      }
    });
  }
}
