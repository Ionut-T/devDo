import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from 'src/app/material.module';

import { TopnavComponent } from './topnav/topnav.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  declarations: [TopnavComponent, SidenavComponent],
  imports: [CommonModule, MaterialModule, AppRoutingModule, FooterModule],
  exports: [SidenavComponent]
})
export class NavigationModule {}
