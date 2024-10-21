import { AuthService } from './../services/auth.service';
import { ClothesStock } from '../models/clothesStock.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { slideInOutLeft, slideInOutRight, zoomInOut } from '../shared/animations/animation';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-image-wrapper',
  standalone: true,
  imports: [ToastNotificationComponent],
  animations: [slideInOutLeft, slideInOutRight, zoomInOut],
  templateUrl: './image-wrapper.component.html',
  styleUrls: ['./image-wrapper.component.scss']
})
export class ImageWrapperComponent implements OnInit {
  @Input() clothe: ClothesStock = new ClothesStock('', '', 0, '', '', [], '', '', '', '', 0, []);
  @Output() changeImage = new EventEmitter<number>();
  @Output() setActiveImage = new EventEmitter<number>();
  @Input() isAdminMode: boolean = false;
  @Output() productSelected = new EventEmitter<ClothesStock>();
  isFavorite: boolean = false;
  user: User = new User(0, '', '', '', '', '', [], [], '');

  constructor(private router: Router, private userService: UserService, private authService: AuthService) { }

  async ngOnInit() {
    this.user = await this.authService.UserData;
    if (this.user) {
      this.checkIfFavorite();
    }
  }

  checkIfFavorite() {
    this.userService.detectWish(this.user.getId(), this.clothe.getId()).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      },
      error: (error) => {
        console.error('Error al verificar si el producto está en favoritos', error);
      }
    });
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  get isLogging(): Boolean {
    return this.authService.isLoggedIn;
  }

  toggleFavorite(clothe: ClothesStock) {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      const newWish = {
        id: clothe.getId(),
        name: clothe.getName(),
        url: clothe.getCode(),
        photo: clothe.getImages()[0]?.getUrl(),
      };
      this.userService.addToWisheList(this.user.getId(), newWish).subscribe({
        next: (response) => {
          console.log('Producto agregado a favoritos', response);
        },
        error: (error) => console.error('Error al agregar a favoritos', error)
      });
    } else {
      this.userService.removeFromWisheList(this.user.getId(), clothe.getId()).subscribe({
        next: (response) => {
          console.log('Producto removido de favoritos', response);
        },
        error: (error) => console.error('Error al remover de favoritos', error)
      });
    }
  }
}
