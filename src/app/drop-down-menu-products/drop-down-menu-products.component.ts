import { AuthService } from './../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drop-down-menu-products',
  standalone: true,
  imports: [],
  templateUrl: './drop-down-menu-products.component.html',
  styleUrls: ['./drop-down-menu-products.component.scss']
})
export class DropDownMenuProductsComponent implements OnInit {
  @Input() groupedClothes: { [genericType: string]: string[] } = {};
  isAdminMode: Boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  async ngOnInit() {
    try {
      this.isAdminMode = await this.authService.isAdmin();
    } catch (error) {
      console.error('Error checking admin status:', error);
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
