import { Router } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { slideDownUp } from '../../shared/animations/animation';
import { ClothesStock } from '../../models/clothesStock.model';
import { ImageService } from '../../services/image.service';
import { NotificationService } from '../../services/notification.service';
import { SearchService } from '../../services/search.service';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';

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

  constructor(
    private router: Router,
    private imageService: ImageService,
    public notificationService: NotificationService,
    private searchService: SearchService,
    private meta: Meta,
    private titleService: Title
  ) {
    this.titleService.setTitle('Search Clothes - Your Store Name');
    this.meta.addTags([
      { name: 'description', content: 'Search for clothes in our store. Find the best deals and latest trends.' },
      { name: 'keywords', content: 'clothes, search, fashion, store, buy clothes' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
    ]);
  }

  ngOnInit() { }

  async searchClothes() {
    if (this.searchQuery) {
      this.searchResults = await this.searchService.searchClothes(this.searchQuery);
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

  viewProduct(clothe: ClothesStock): void {
    this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  preventNumberInput(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      this.handleNotification('Por favor, ingrese solo letras en este campo.', false);
      event.preventDefault();
    }
  }

  onImageError(event: Event) {
    this.imageService.handleImageError(event);
  }

  private handleNotification(message: string, isSuccess: boolean): void {
    this.notificationService.handleNotification(message, isSuccess);
  }
}
