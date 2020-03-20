import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { DialogModule } from '../components/dialog/dialog.module';
import { ModalModule } from '../components/modal/modal.module';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { UppercaseFirstLetterPipe } from './uppercase-first-letter.pipe';
import { CreateProjectComponent } from './create-project/create-project.component';
import { TasksCardListComponent } from './tasks/tasks-card-list/tasks-card-list.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    TasksComponent,
    CreateTaskComponent,
    UppercaseFirstLetterPipe,
    CreateProjectComponent,
    TasksCardListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectsRoutingModule,
    MaterialModule,
    DialogModule,
    ModalModule
  ]
})
export class ProjectsModule {}
