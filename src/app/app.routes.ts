import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ClothesGalleryComponent } from './clothes-gallery/clothes-gallery.component';
import { UniqueProductComponent } from './unique-product/unique-product.component';
import { LoginComponent } from './login/login.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { AdminComponent } from './admin/admin.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create-user', component: UserComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'clothes-gallery', component: ClothesGalleryComponent },
  { path: 'product/:code', component: UniqueProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart-detail', component: CartDetailComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
