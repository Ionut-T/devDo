import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board.component';
import { EditTaskComponent } from './edit-task/edit-task.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  { path: 'todo/edit/:todoId', component: EditTaskComponent },
  { path: 'doing/edit/:doingId', component: EditTaskComponent },
  { path: 'done/edit/:doneId', component: EditTaskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule {}
