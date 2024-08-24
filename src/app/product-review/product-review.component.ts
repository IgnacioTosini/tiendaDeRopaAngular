import { AuthService } from './../services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Comment } from '../models/comment.model';
import { CommentService } from '../services/comment.service';
import { User } from '../models/user.model';
import { ClothesStock } from '../models/clothesStock.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [],
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit, OnChanges {
  @Input() reviews: any[] = [];
  @Input() productId: string = ''; // Asume que cada producto tiene un ID único
  @Input() userId: number = 0; // Asume que cada usuario tiene un ID único
  @Output() reviewAdded = new EventEmitter<Comment>();
  @Input() product!: ClothesStock;
  user: User = new User(0, '', '', '', '', '', [], [], '');

  constructor(private commentService: CommentService, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    this.user = await this.authService.UserData;
    this.userId = this.user.getId();
    this.productId = this.product.getId();
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && !changes['product'].firstChange) {
      this.productId = this.product.getId();
      this.loadComments();
    }
  }

  loadComments() {
    this.commentService.findComments(this.productId).subscribe({
      next: (comments) => {
        this.reviews = comments.length > 0 ? comments : [];
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
        this.reviews = [];
      }
    });
  }

  addReview(reviewText: string) {
    if (!reviewText) return; // No hacer nada si el texto está vacío

    if (!this.userId || !this.productId) {
      console.error('El usuario o el producto no tienen un ID asignado.');
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
        this.reloadComponent();
      },
      error: (error) => {
        console.error('Error al agregar comentario:', error);
        console.log(error.error);
      }
    });
  }

  reloadComponent() {
    this.router.navigate([`/product/${this.product.getCode()}`]).then(() => {
      window.location.reload();
    });
  }
}
