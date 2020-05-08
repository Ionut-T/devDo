import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
  isHandset$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {}

  /**
   * Get authentication status.
   */
  ngOnInit() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    );

    this.isLoggedIn$ = this.authService.getAuthStatusListener().pipe(map(isLoggedIn => isLoggedIn));
  }

  /**
   * Toggle side navigation.
   */
  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  /**
   * Change theme.
   */
  onToggleTheme() {
    this.toggleTheme.emit();
  }

  /**
   * Log out user.
   */
  onLogout() {
    this.authService.logout();
  }
}
