import { Component, OnInit } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favorites: ClothesStock[] = [];

  constructor() { }

  ngOnInit(): void {
    // Aquí debes obtener los productos favoritos del usuario y asignarlos a 'favorites'
  }
}
