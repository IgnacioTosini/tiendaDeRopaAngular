import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-drop-down-menu-products',
  standalone: true,
  imports: [],
  templateUrl: './drop-down-menu-products.component.html',
  styleUrls: ['./drop-down-menu-products.component.scss']
})
export class DropDownMenuProductsComponent implements OnInit {
  @Input() groupedClothes: { [genericType: string]: string[] } = {}; // Definir como @Input
  isAdminMode: Boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedDataService: SharedDataService
  ) { }

  async ngOnInit() {
    try {
      this.isAdminMode = await this.authService.isAdmin();
      this.addMetaTags();

      // Suscríbete a los cambios en groupedClothes
      this.sharedDataService.groupedClothes$.subscribe(groupedClothes => {
        if (groupedClothes) {
          this.groupedClothes = groupedClothes;
          console.log('DropDownMenuProductsComponent groupedClothes:', this.groupedClothes);
        }
      });
    } catch (error) {
      console.error('Error checking admin status:', error);
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
}
