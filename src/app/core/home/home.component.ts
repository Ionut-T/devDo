import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Home page component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  /**
   * Redirect user to sign up page
   */
  onSignUp() {
    this.router.navigate(['/user/signup']);
  }

  /**
   * Redirect user to log in page
   */
  onLogIn() {
    this.router.navigate(['/user/login']);
  }
}
