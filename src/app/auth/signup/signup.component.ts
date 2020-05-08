import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MustMatch } from './must-match.validator';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { finalize, min } from 'rxjs/operators';
import { displayFormErrors } from 'src/app/shared/form-errors.utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  public hidePassword = true;
  public hideConfirmPassword = true;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) {}

  /**
   * Create and validate the reactive sign up form.
   */
  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
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
  public get formCtrls(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  /**
   * Displays form errors.
   */
  public displayFormErrors(control: AbstractControl, placeholder: string, minLength?: number): string {
    return displayFormErrors(control, placeholder, minLength);
  }

  /**
   * Signup user.
   */
  public onSubmit(): void {
    this.isLoading = true;
    this.authService
      .signup(
        this.formCtrls.firstName.value,
        this.formCtrls.email.value,
        this.formCtrls.password.value,
        this.formCtrls.confirmPassword.value
      )
      .pipe(finalize(() => (this.isLoading = false)))
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
