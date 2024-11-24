import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private groupedClothesSource = new BehaviorSubject<{ [genericType: string]: string[] } | null>(null);
  groupedClothes$ = this.groupedClothesSource.asObservable();

  setGroupedClothes(groupedClothes: { [genericType: string]: string[] }) {
    this.groupedClothesSource.next(groupedClothes);
  }
}
