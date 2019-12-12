import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/material.module';

import { EmailRoutingModule } from './email-routing.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
  declarations: [VerifyEmailComponent],
  imports: [CommonModule, EmailRoutingModule, MaterialModule]
})
export class EmailModule {}
