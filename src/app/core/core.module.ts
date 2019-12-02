import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppRoutingModule } from '../app-routing.module';
import { NavigationModule } from './navigation/navigation.module';

@NgModule({
  declarations: [HomeComponent, PageNotFoundComponent],
  imports: [CommonModule, AppRoutingModule, MaterialModule, NavigationModule],
  exports: [NavigationModule]
})
export class CoreModule {}
