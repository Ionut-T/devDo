import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { MustMatch } from '../../signup/must-match.validator';
import { AuthService } from '../../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { displayFormErrors } from 'src/app/shared/form-errors.utils';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetForm = this.fb.group(
      {
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
    return this.resetForm.controls;
  }

  /**
   * Displays control errors.
   */
  public displayFormErrors(control: FormControl, placeholder: string): string {
    return displayFormErrors(control, placeholder);
  }

  /**
   * Reset password.
   */
  onSubmit() {
    this.route.paramMap
      .pipe(
        map(param => param.get('token')),
        switchMap(token =>
          this.authService.resetPassword(token, this.formCtrls.password.value, this.formCtrls.confirmPassword.value)
        )
      )
      .subscribe(res => {
        this.uiService.showSnackBar(res.message, null, 5000, 'top');
        this.router.navigateByUrl('authentication/login');
      });
  }
}
