import { ClothesStockService } from './../services/clothes-stock.service';
import { Component } from '@angular/core';
import { Clothes } from '../models/clothes.model';
import { Router } from '@angular/router';
import { ClothesStock } from '../models/clothesStock.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  clothes: ClothesStock[] = []; // Modificado para ser un arreglo de Clothes

  constructor(private router: Router, private ClothesStockService: ClothesStockService) { }

  async ngOnInit() {
    await this.ClothesStockService.findAll().toPromise();
    this.clothes = this.ClothesStockService.clothesArray;
  }

  goToProduct(clothe: Clothes) {
    this.router.navigate(['/product', clothe.getId()]);
  }
}
