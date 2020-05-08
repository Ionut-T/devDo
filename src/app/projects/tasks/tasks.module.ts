import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing.module';

import { TasksComponent } from './tasks.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TasksCardListComponent } from './tasks-card-list/tasks-card-list.component';

import { MaterialModule } from 'src/app/material.module';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { DialogModule } from 'src/app/components/dialog/dialog.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [TasksComponent, CreateTaskComponent, TasksCardListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    MaterialModule,
    ModalModule,
    DialogModule,
    PipesModule
  ]
})
export class TasksModule {}
