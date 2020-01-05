import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { routerAnimation } from './animations/router.animation';

/**
 * Root component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerAnimation]
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  /**
   * Initialize authentication.
   */
  ngOnInit() {
    this.authService.initAuthentication();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
