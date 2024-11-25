import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { ClothesStock } from '../../models/clothesStock.model';

@Component({
  selector: 'app-drop-down-menu-products',
  standalone: true,
  imports: [],
  templateUrl: './drop-down-menu-products.component.html',
  styleUrls: ['./drop-down-menu-products.component.scss']
})
export class DropDownMenuProductsComponent implements OnInit {
  groupedClothes: { [genericType: string]: string[] } = {};
  isAdminMode: Boolean = false;

  constructor(private router: Router, private authService: AuthService, private clothesStockService: ClothesStockService) { }

  async ngOnInit() {
    try {
      this.isAdminMode = await this.authService.isAdmin();
      this.addMetaTags();
    } catch (error) {
      console.error('Error checking admin status:', error);
    }

    try {
      const response = await this.clothesStockService.findAll(0, 10).toPromise();
      const clothes = response?.clothes || [];
      this.groupedClothes = this.groupByTypes(clothes);
    } catch (error) {
      console.error('Error loading clothes:', error);
    }
  }

  addMetaTags() {
    if (typeof document !== 'undefined') {
      const metaTags = [
        { name: 'description', content: 'Explore our wide range of clothing products. Find the best clothes for men, women, and children.' },
        { name: 'keywords', content: 'clothes, fashion, men, women, children, buy clothes, clothing store' }
      ];
      metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.name = tag.name;
        meta.content = tag.content;
        document.head.appendChild(meta);
      });
    } else {
      console.error('document is not defined');
    }
  }

  get isLogging(): Boolean {
    return this.authService.isLoggedIn;
  }

  getGenericTypes() {
    return Object.keys(this.groupedClothes);
  }

  goToGallery(type: string) {
    this.router.navigate(['/clothes-gallery', { type }]);
  }

  private groupByTypes(clothes: ClothesStock[]): { [genericType: string]: string[] } {
    const grouped: { [key: string]: string[] } = {};

    clothes.forEach(clothe => {
      const genericType = clothe.getGenericType();
      const specificType = clothe.getSpecificType();

      if (!grouped[genericType]) {
        grouped[genericType] = [];
      }
      if (!grouped[genericType].includes(specificType)) {
        grouped[genericType].push(specificType);
      }
    });

    return grouped;
  }
}
