import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { displayFormErrors } from 'src/app/shared/form-errors.utils';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public email: FormControl;
  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit(): void {
    this.email = new FormControl(null, [Validators.required, Validators.email]);
  }

  /**
   * Displays control errors.
   */
  public displayFormErrors(control: FormControl, placeholder: string): string {
    return displayFormErrors(control, placeholder);
  }

  /**
   * Send reset password email.
   */
  public onSubmit(): void {
    this.authService.forgotPassword(this.email.value).subscribe(() => {
      this.uiService.showSnackBar('A link for resetting your password is in its way to your inbox.', null, 5000, 'top');
      this.onClose();
    });
  }

  /**
   * Close modal.
   */
  public onClose(): void {
    this.close.emit();
  }
}
