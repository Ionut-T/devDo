import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material.module';

import { EmailRoutingModule } from './email-routing.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [VerifyEmailComponent, ResetPasswordComponent],
  imports: [CommonModule, EmailRoutingModule, ReactiveFormsModule, MaterialModule]
})
export class EmailModule {}
