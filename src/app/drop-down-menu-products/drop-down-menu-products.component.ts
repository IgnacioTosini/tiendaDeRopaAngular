import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drop-down-menu-products',
  standalone: true,
  imports: [],
  templateUrl: './drop-down-menu-products.component.html',
  styleUrl: './drop-down-menu-products.component.scss'
})
export class DropDownMenuProductsComponent {
  @Input() groupedClothes: { [genericType: string]: string[] } = {};
  @Input() isLogging: Boolean = false;
  @Input() isAdminIn: Boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  getGenericTypes() {
    return Object.keys(this.groupedClothes);
  }

  goToGallery(type: string) {
    this.router.navigate(['/clothes-gallery', { type }]);
  }
}
