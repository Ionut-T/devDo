import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from './must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private formBuilder: FormBuilder) {}

  /**
   * Create and validate the reactive register form.
   */
  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }

  /**
   *  Getter for easy access to form fields.
   */
  get form() {
    return this.signupForm.controls;
  }

  /**
   * Handle sign up form errors -> email field.
   */
  emailErrorHandler() {
    if (this.form.email.hasError('required')) {
      return 'You must enter a valid email';
    } else if (this.form.email.hasError('email')) {
      return 'This is not a valid email';
    }
    return null;
  }

  /**
   * Handle sign up form errors -> password field.
   */
  passwordErrorHandler() {
    if (this.form.password.hasError('required')) {
      return 'You must enter a password';
    } else if (this.form.password.hasError('minlength')) {
      return 'The password is too short. Please enter minimum 6 characters';
    }
    return null;
  }

  /**
   * Handle sign up form errors -> confirm-password field.
   */
  confirmPasswordErrorHandler() {
    if (this.form.confirmPassword.hasError('required')) {
      return 'You must confirm your password';
    } else if (this.form.confirmPassword.hasError('mustMatch')) {
      return 'Passwords do not match';
    }
    return null;
  }

  onSubmit() {}
}
