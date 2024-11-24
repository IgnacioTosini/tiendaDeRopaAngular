import { ImageService } from './../services/image.service';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AuthService } from './../services/auth.service';
import { NavigationService } from './../services/navigation-service.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Wish } from '../models/wish.model';
import { GlobalConstants } from '../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  user: User = new User(0, '', '', '', '', '', [], [], '');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private navigationService: NavigationService,
    private meta: Meta,
    private titleService: Title,
    private imageService: ImageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  async ngOnInit() {
    this.user = await this.authService.UserData;
    this.titleService.setTitle('Your Favorite Products - Clothing Store');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Discover and manage your favorite products in our clothing store. Find the best fashion items and keep track of your favorites.' },
      { name: 'keywords', content: 'favorites, clothing store, products, fashion, wishlist, favorite products, best fashion items' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { name: 'og:title', content: 'Your Favorite Products - Clothing Store' },
      { name: 'og:description', content: 'Discover and manage your favorite products in our clothing store. Find the best fashion items and keep track of your favorites.' },
      { name: 'twitter:title', content: 'Your Favorite Products - Clothing Store' },
      { name: 'twitter:description', content: 'Discover and manage your favorite products in our clothing store. Find the best fashion items and keep track of your favorites.' },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }

  goToFavoriteProduct(favorite: Wish) {
    this.navigationService.goToProductFromWish(favorite);
  }

  removeFavorite(wish: Wish) {
    this.userService.removeFromWisheList(this.user.getId(), wish.getId()).subscribe({
      next: (response) => {
        console.log('Producto removido de favoritos', response);
        this.user.setWisheList(this.user.getWisheList().filter(item => item.getId() !== wish.getId()));
      },
      error: (error) => console.error('Error al remover de favoritos', error)
    });
  }

  onImageError(event: Event) {
    this.imageService.handleImageError(event);
  }
}
