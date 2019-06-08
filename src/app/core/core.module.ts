import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [NavigationComponent, HomeComponent],
  imports: [CommonModule, AppRoutingModule, MaterialModule],
  exports: [NavigationComponent]
})
export class CoreModule {}
