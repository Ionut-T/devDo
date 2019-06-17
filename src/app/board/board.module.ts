import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { TodoComponent } from './todo/todo.component';
import { DoingComponent } from './doing/doing.component';
import { DoneComponent } from './done/done.component';
import { CreateTaskComponent } from './todo/create-task/create-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { UppercaseFirstLetterPipe } from './uppercase-first-letter.pipe';

@NgModule({
  declarations: [
    BoardComponent,
    TodoComponent,
    DoingComponent,
    DoneComponent,
    CreateTaskComponent,
    EditTaskComponent,
    UppercaseFirstLetterPipe
  ],
  imports: [CommonModule, FormsModule, BoardRoutingModule, MaterialModule]
})
export class BoardModule {}
