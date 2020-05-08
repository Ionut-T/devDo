import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

/**
 * Home page component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuth = false;
  private authListenerSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => (this.isAuth = isAuth));
  }

  /**
   * Redirect user to sign up page
   */
  onSignUp() {
    this.router.navigateByUrl('/authentication/signup');
  }

  /**
   * Unsubscribe from subscriptions
   */
  ngOnDestroy() {
    if (this.authListenerSubscription) {
      this.authListenerSubscription.unsubscribe();
    }
  }
}
