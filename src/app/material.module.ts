import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatExpansionModule,
  MatDialogModule,
  MatInputModule
} from '@angular/material';

@NgModule({
  exports: [
    LayoutModule,
    DragDropModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class MaterialModule {}
