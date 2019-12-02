import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { UppercaseFirstLetterPipe } from './uppercase-first-letter.pipe';
import { TasksCardListComponent } from './tasks/tasks-card-list/tasks-card-list.component';
import { DialogModule } from '../components/dialog/dialog.module';

@NgModule({
  declarations: [BoardComponent, TasksComponent, CreateTaskComponent, UppercaseFirstLetterPipe, TasksCardListComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BoardRoutingModule, MaterialModule, DialogModule]
})
export class BoardModule {}
