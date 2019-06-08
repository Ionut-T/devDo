import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  loginForm: FormGroup;

  constructor() {}

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
   * Log in the user.
   */
  onSubmit() {}
}
