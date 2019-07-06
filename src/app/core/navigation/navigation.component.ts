import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  isOpened = false;
  isAuth = false;
  private authListenerSubscription: Subscription;
  @ViewChild('drawer', { static: false }) drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {}

  /**
   * Get authentication status
   */
  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => {
        this.isAuth = isAuth;
      });
  }

  /**
   * Log out user
   */
  onLogout() {
    this.authService.logout();
    this.drawer.close();
  }

  /**
   * Unsubscribe from subscription
   */
  ngOnDestroy() {
    if (this.authListenerSubscription) {
      this.authListenerSubscription.unsubscribe();
    }
  }
}
