import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isDarkTheme = false;
  isHandset$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  @ViewChild('drawer') drawer: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {}

  /**
   * Observe breakpoints.
   * Check if user is logged in.
   */
  ngOnInit() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    );

    this.isLoggedIn$ = this.authService.getAuthStatusListener().pipe(map(isLoggedIn => isLoggedIn));
  }

  /**
   * Toggle theme.
   */
  onToggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  /**
   * Log out user
   */
  onLogout() {
    this.authService.logout();
    this.drawer.close();
  }
}
