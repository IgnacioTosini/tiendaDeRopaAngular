import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClothesStock } from '../models/clothesStock.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedClothesSource = new BehaviorSubject<ClothesStock | null>(null);
  selectedClothes$ = this.selectedClothesSource.asObservable();

  setSelectedClothes(clothes: ClothesStock | null) {
    console.log(clothes);
    this.selectedClothesSource.next(clothes);
  }
}
