import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

/**
 * Root component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  /**
   * Authenticate user automatically
   */
  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
