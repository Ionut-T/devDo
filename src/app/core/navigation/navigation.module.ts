import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from 'src/app/material.module';

import { TopnavComponent } from './topnav/topnav.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  declarations: [TopnavComponent, SidenavComponent],
  imports: [CommonModule, MaterialModule, AppRoutingModule],
  exports: [SidenavComponent]
})
export class NavigationModule {}
