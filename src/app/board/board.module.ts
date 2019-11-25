import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { UppercaseFirstLetterPipe } from './uppercase-first-letter.pipe';

@NgModule({
  declarations: [BoardComponent, TasksComponent, CreateTaskComponent, EditTaskComponent, UppercaseFirstLetterPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BoardRoutingModule, MaterialModule]
})
export class BoardModule {}
