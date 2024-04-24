import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CreateClotheComponent } from './create-clothe/create-clothe.component';
import { UniqueProductComponent } from './unique-product/unique-product.component';
import { UserComponent } from './user/user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HomeComponent, NavbarComponent, FooterComponent, CarouselComponent, CreateClotheComponent, UniqueProductComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tiendaDeRopaAngular';
}
