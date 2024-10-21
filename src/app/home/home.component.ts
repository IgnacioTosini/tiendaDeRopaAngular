import { Component } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import { CreateClotheComponent } from "../create-clothe/create-clothe.component";
import { GalleryComponent } from '../gallery/gallery.component';
import { UniqueProductComponent } from '../unique-product/unique-product.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CarouselComponent, GalleryComponent, CreateClotheComponent, UniqueProductComponent]
})
export class HomeComponent {

}
