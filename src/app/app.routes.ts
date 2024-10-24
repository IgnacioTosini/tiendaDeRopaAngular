import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ClothesGalleryComponent } from './clothes-gallery/clothes-gallery.component';
import { LoginComponent } from './login/login.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { AdminComponent } from './admin/admin.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AdminGuard } from './guards/adminGuard.guard';
import { AuthGuard } from './guards/authGuard.guard';
import { UniqueProductComponent } from './unique-product/unique-product.component';
import { ViewUsersPageComponent } from './view-users-page/view-users-page.component';
import { ViewInvoicesPageComponent } from './view-invoices-page/view-invoices-page.component';
import { ViewCreateProductPageComponent } from './view-create-product-page/view-create-product-page.component';
import { ViewModifyProductPageComponent } from './view-modify-product-page/view-modify-product-page.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create-user', component: RegisterComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'viewProductsPage', component: AdminComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: 'viewUserPage', component: ViewUsersPageComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: 'viewInvoicesPage', component: ViewInvoicesPageComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: 'createProductPage', component: ViewCreateProductPageComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: 'modifyProductPage', component: ViewModifyProductPageComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: 'clothes-gallery', component: ClothesGalleryComponent },
  { path: 'product/:code', component: UniqueProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart-detail', component: CartDetailComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard]  },
  { path: 'refresh', component: HomeComponent }, // Ruta temporal para forzar la recarga
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
