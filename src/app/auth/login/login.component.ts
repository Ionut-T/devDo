import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  hidePassword = true;
  loginForm: FormGroup;
  isLoading = false;
  private loadingSubscription: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {}

  /**
   * Create and validate the reactive login form.
   */
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, { validators: Validators.required })
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  /**
   *  Handle log in form errors -> email.
   */
  emailErrorHandler() {
    if (this.form.email.hasError('required')) {
      return 'Please enter your email';
    } else if (this.form.email.hasError('email')) {
      return 'Please enter a valid email';
    }
    return null;
  }

  /**
   * Handle log in form errors -> password.
   */
  passwordErrorHandler() {
    if (this.form.password.hasError('required')) {
      return 'Please enter your password';
    }
    return null;
  }

  /**
   * Call log in user.
   */
  onSubmit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => (this.isLoading = isLoading)
    );
    this.authService.login(this.form.email.value, this.form.password.value);
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
