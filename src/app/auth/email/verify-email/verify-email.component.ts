import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user.service';
import { map, concatMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  errorMessage: string;

  constructor(private authService: AuthService, private route: ActivatedRoute, private userService: UserService) {}

  /**
   * Validate user's email address.
   */
  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(param => param.get('token')),
        concatMap(token => this.authService.getEmailVerifyToken(token)),
        concatMap(res => this.userService.update(res.token.userId, { isVerified: true })),
        catchError(error => (this.errorMessage = error.error.message))
      )
      .subscribe();
  }
}
