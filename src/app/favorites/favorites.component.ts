import { NavigationService } from './../services/navigation-service.service';
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
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  user: User = new User(0, '', '', '', '', '', [], [], '');

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private navigationService: NavigationService
  ) { }

  async ngOnInit() {
    this.user = await this.authService.UserData;
  }

  goToFavoriteProduct(favorite: Wish) {
    this.navigationService.goToProductFromWish(favorite);
  }

  removeFavorite(wish: Wish) {
    this.userService.removeFromWisheList(this.user.getId(), wish.getId()).subscribe({
      next: (response) => {
        console.log('Producto removido de favoritos', response);
        // Actualizar la lista de deseos del usuario en el componente
        this.user.setWisheList(this.user.getWisheList().filter(item => item.getId() !== wish.getId()));
      },
      error: (error) => console.error('Error al remover de favoritos', error)
    });
  }
}
