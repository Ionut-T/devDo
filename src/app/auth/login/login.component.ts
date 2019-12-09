import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  loginForm: FormGroup;

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

  /**
   *  Getter for easy access to form fields.
   */
  get formCtrls(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  /**
   *  Handle log in form errors -> email.
   */
  emailErrorHandler() {
    if (this.formCtrls.email.hasError('required')) {
      return 'Please enter your email';
    } else if (this.formCtrls.email.hasError('email')) {
      return 'Please enter a valid email';
    }
    return null;
  }

  /**
   * Handle log in form errors -> password.
   */
  passwordErrorHandler() {
    if (this.formCtrls.password.hasError('required')) {
      return 'Please enter your password';
    }
    return null;
  }

  /**
   * Call log in user.
   */
  onSubmit() {
    this.authService.login(this.formCtrls.email.value, this.formCtrls.password.value).subscribe();
  }
}
