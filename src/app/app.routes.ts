import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ClothesGalleryComponent } from './clothes-gallery/clothes-gallery.component';
import { UniqueProductComponent } from './unique-product/unique-product.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create-user', component: UserComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'clothes-gallery', component: ClothesGalleryComponent },
  { path: 'product/:id', component: UniqueProductComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
