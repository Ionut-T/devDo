import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board.component';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  { path: 'tasks/edit/:taskId', component: EditTaskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule {}
