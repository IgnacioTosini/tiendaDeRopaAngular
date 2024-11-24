import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ClothesStock } from '../models/clothesStock.model';
import { Wish } from '../models/wish.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  goToProduct(clothe: ClothesStock): void {
    this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  goToProductAdminMode(clothe: ClothesStock, isAdminMode: boolean, selectedClothe: ClothesStock | null): ClothesStock | null {
    if (isAdminMode) {
      return selectedClothe === clothe ? null : clothe;
    } else {
      this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      });
      return selectedClothe;
    }
  }

  viewProduct(clothe: ClothesStock): void {
    this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  goToProductFromWish(favorite: Wish): void {
    this.router.navigate(['/product', favorite.getUrl()], { state: { name: favorite.getName() } }).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }
}
