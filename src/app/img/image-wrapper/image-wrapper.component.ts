import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { slideInOutLeft, slideInOutRight, zoomInOut } from '../../shared/animations/animation';
import { ClothesStock } from '../../models/clothesStock.model';
import { User } from '../../models/user.model';
import { ImageService } from '../../services/image.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-image-wrapper',
  standalone: true,
  imports: [],
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

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private imageService: ImageService, private meta: Meta) { }

  async ngOnInit() {
    this.user = await this.authService.UserData;
    if (this.user) {
      this.checkIfFavorite();
    }
    this.setMetaTags();
  }

  setMetaTags() {
    this.meta.addTags([
      { name: 'description', content: `Buy ${this.clothe.getName()} at our store. High quality and affordable prices.` },
      { name: 'keywords', content: `${this.clothe.getName()}, clothes, fashion, buy clothes online` },
      { name: 'robots', content: 'index, follow' }
    ]);
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

  viewProduct(clothe: ClothesStock): void {
    this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
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

  onImageError(event: Event) {
    this.imageService.handleImageError(event);
  }

  onImageClick() {
    this.viewProduct(this.clothe);
  }
}
