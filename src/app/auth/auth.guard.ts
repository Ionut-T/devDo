import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Guard for route protection.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if the user has permissions to access
   * a protected route before the bundle is loaded.
   */
  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      return this.router.navigateByUrl('/authentication/login');
    }
    return isAuth;
  }
}
