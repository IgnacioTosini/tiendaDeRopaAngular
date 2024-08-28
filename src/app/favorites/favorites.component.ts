import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Wish } from '../models/wish.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  user: User = new User(0, '', '', '', '', '', [], [], '');
  isFavorite: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.user = await this.authService.UserData;
    if (this.user) {
      this.checkIfFavorite();
    }
  }

  checkIfFavorite() {
    let wish = this.user.getWisheList();
    this.userService.detectWish(this.user.getId(), wish[0].getId()).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      },
      error: (error) => {
        console.error('Error al verificar si el producto está en favoritos', error);
      }
    });
  }

  goToProduct(favorite: Wish) {
    this.router.navigate(['/product', favorite.getUrl()]);
  }

  toggleFavorite(wish: Wish) {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      const newWish = {
        id: wish.getId(),
        name: wish.getName(),
        url: wish.getUrl(),
        photo: wish.getPhoto(),
      };
      this.userService.addToWisheList(this.user.getId(), newWish).subscribe({
        next: (response) => {
          console.log('Producto agregado a favoritos', response);
          this.reloadComponent();
        },
        error: (error) => console.error('Error al agregar a favoritos', error)
      });
    } else {
      this.userService.removeFromWisheList(this.user.getId(), wish.getId()).subscribe({
        next: (response) => {
          console.log('Producto removido de favoritos', response);
          this.reloadComponent();
        },
        error: (error) => console.error('Error al remover de favoritos', error)
      });
    }
  }

  reloadComponent() {
    this.router.navigate(['/favorites']).then(() => {
      window.location.reload();
    });
  }
}
