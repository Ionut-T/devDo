import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { DialogModule } from '../components/dialog/dialog.module';
import { ModalModule } from '../components/modal/modal.module';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [ProjectsComponent, CreateProjectComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectsRoutingModule,
    MaterialModule,
    DialogModule,
    ModalModule,
    PipesModule
  ]
})
export class ProjectsModule {}
