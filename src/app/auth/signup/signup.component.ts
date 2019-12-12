import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MustMatch } from './must-match.validator';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) {}

  /**
   * Create and validate the reactive sign up form.
   */
  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
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
  get formCtrls(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }
  /**
   * Handle sign up form errors -> email field.
   */
  getNameErrors() {
    if (this.formCtrls.firstName.hasError('required') || this.formCtrls.lastName.hasError('required')) {
      return 'This field is required';
    } else if (this.formCtrls.firstName.hasError('minlength') || this.formCtrls.lastName.hasError('minlength')) {
      return 'Username must have minimum 2 characters';
    }
    return null;
  }

  /**
   * Handle sign up form errors -> email field.
   */
  getEmailErrors() {
    if (this.formCtrls.email.hasError('required')) {
      return 'You must enter a valid email';
    } else if (this.formCtrls.email.hasError('email')) {
      return 'This.form is not a valid email';
    }
    return null;
  }

  /**
   * Handle sign up form errors -> password field.
   */
  getPasswordErrors() {
    if (this.formCtrls.password.hasError('required')) {
      return 'You must enter a password';
    } else if (this.formCtrls.password.hasError('minlength')) {
      return 'The password is too short. Please enter minimum 6 characters';
    }
    return null;
  }

  /**
   * Handle sign up form errors -> confirm-password field.
   */
  getConfirmPasswordErrors() {
    if (this.formCtrls.confirmPassword.hasError('required')) {
      return 'You must confirm your password';
    } else if (this.formCtrls.confirmPassword.hasError('mustMatch')) {
      return 'Passwords do not match';
    }
    return null;
  }

  /**
   * Signup user.
   */
  onSubmit() {
    this.authService
      .signup(
        this.formCtrls.firstName.value,
        this.formCtrls.lastName.value,
        this.formCtrls.email.value,
        this.formCtrls.password.value,
        this.formCtrls.confirmPassword.value
      )
      .subscribe(() => {
        this.uiService.showSnackBar(
          'A confirmation email is on its way to your inbox. Please confirm your email before login',
          null,
          5000,
          'top'
        );
        this.router.navigateByUrl('authentication/login');
      });
  }
}
