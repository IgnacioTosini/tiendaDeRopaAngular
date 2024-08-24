import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

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
