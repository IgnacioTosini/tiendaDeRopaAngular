import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Title, Meta } from '@angular/platform-browser';
import { GlobalConstants } from '../config/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.titleService.setTitle('Admin - Your App Name');
    this.metaService.addTags([
      { name: 'description', content: 'Admin access to manage and oversee the platform.' },
      { name: 'keywords', content: 'admin, management, platform, your app name' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
    ]);
  }

  async canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const isAdmin = this.authService.isAdmin();
        if (this.authService.UserLogged && isAdmin) {
          console.log('User is admin', isAdmin);
          resolve(true);
        } else if (this.authService.UserLogged) {
          console.log('User is not admin');
          this.router.navigate(['/home']);
          resolve(false);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        this.router.navigate(['/login']);
        resolve(false);
      }
    });
  }
}
