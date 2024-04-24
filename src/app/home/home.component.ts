import { Component } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import { CreateClotheComponent } from "../create-clothe/create-clothe.component";
import { UniqueProductComponent } from '../unique-product/unique-product.component';
import { RouterOutlet } from '@angular/router';
import { Clothes } from '../models/clothes.model';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CarouselComponent, GalleryComponent, CreateClotheComponent, UniqueProductComponent]
})
export class HomeComponent {

}
