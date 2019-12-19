import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: FormControl;
  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.email = new FormControl(null, [Validators.required, Validators.email]);
  }

  /**
   * Handle email errors.
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
   * Send email.
   */
  onSubmit() {
    this.authService.forgotPassword(this.email.value).subscribe(() => {
      this.uiService.showSnackBar('A link for resetting your password is in its way to your inbox.', null, 5000, 'top');
      this.onClose();
    });
  }

  /**
   * Close modal.
   */
  onClose() {
    this.close.emit();
  }
}
