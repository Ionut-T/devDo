import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { displayFormErrors } from 'src/app/shared/form-errors.utils';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public hidePassword = true;
  public isForgotPassword = false;
  public isLoading = false;

  constructor(private authService: AuthService, private uiService: UIService) {}

  /**
   * Create and validate the reactive login form.
   */
  ngOnInit(): void {
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
  public get formCtrls(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  /**
   * Displays form errors.
   */
  public displayFormErrors(control: AbstractControl, placeholder: string): string {
    return displayFormErrors(control, placeholder);
  }

  /**
   * Logs in user.
   */
  public onSubmit(): void {
    this.isLoading = true;

    this.authService
      .login(this.formCtrls.email.value, this.formCtrls.password.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe();
  }

  /**
   * Opens forgot-password modal.
   */
  public onForgotPassword(): void {
    this.isForgotPassword = true;
  }
}
