import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.titleService.setTitle('Login - Your App Name');
    this.metaService.addTags([
      { name: 'description', content: 'Login to access your account and explore our exclusive collection.' },
      { name: 'keywords', content: 'login, user account, exclusive collection, your app name' }
    ]);
  }

  async canActivate(): Promise<boolean> {
    try {
      if (this.authService.UserLogged) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
