import { ClothesStockService } from './../services/clothes-stock.service';
import { Router } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClothesStock } from '../models/clothesStock.model';
import { slideDownUp } from '../shared/animations/animation';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, ToastNotificationComponent],
  animations: [slideDownUp],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery: string = '';
  searchResults: ClothesStock[] = [];
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(private router: Router, private clothesStockService: ClothesStockService) { }

  ngOnInit() { }

  async searchClothes() {
    if (this.searchQuery) {
      try {
        const result = await this.clothesStockService.findAll(0, 10).toPromise();
        this.searchResults = result?.clothes.filter(clothe =>
          clothe.getName().toLowerCase().includes(this.searchQuery.toLowerCase())
        ) || [];
      } catch (error) {
        console.error('Error getting clothes:', error);
        this.searchResults = [];
      }
      this.search.emit(this.searchQuery);
    } else {
      this.searchResults = [];
    }
  }

  clearSearch() {
    setTimeout(() => {
      this.searchQuery = '';
      this.searchResults = [];
    }, 100);
  }

  goToProduct(clothe: ClothesStock) {
    this.router.navigate(['/product', clothe.getCode()]);
  }

  preventNumberInput(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      this.showNotification = true;
      this.notificationMessage = 'Por favor, ingrese solo letras en este campo.';
      setTimeout(() => this.showNotification = false, 5000);
      event.preventDefault();
    }
  }
}
