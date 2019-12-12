import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user.service';
import { map, concatMap, catchError } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  email: FormControl;
  errorMessage: string;
  isVisible: boolean;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private uiService: UIService
  ) {}

  /**
   * Validate user's email address.
   */
  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(param => param.get('token')),
        concatMap(token => this.authService.getEmailVerificationToken(token)),
        concatMap(res => this.userService.update(res.token.userId, { isVerified: true })),
        catchError(error => {
          if (error.error.message === 'Your request to verify your email has expired.') {
            this.isVisible = true;
          } else {
            this.isVisible = false;
          }
          return (this.errorMessage = error.error.message);
        })
      )
      .subscribe();

    this.email = new FormControl(null, [Validators.required, Validators.email]);
  }

  /**
   * Handle sign up form errors -> email field.
   */
  getEmailErrors(): string {
    if (this.email.hasError('required')) {
      return 'You must enter your email';
    } else if (this.email.hasError('email')) {
      return 'This is not a valid email';
    }
    return null;
  }

  /**
   * Resend verification email with a new token.
   */
  onSubmit() {
    this.authService.resendVerificationToken(this.email.value).subscribe(() => {
      this.isVisible = false;
      this.uiService.showSnackBar(
        'A confirmation email is on its way to your inbox. Please confirm your email before login',
        null,
        5000,
        'top'
      );
    });
  }
}
