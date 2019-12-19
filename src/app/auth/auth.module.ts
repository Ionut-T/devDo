import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { AuthRoutingModule } from './auth-routing.module';

import { ModalModule } from '../components/modal/modal.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, MaterialModule, ModalModule]
})
export class AuthModule {}
