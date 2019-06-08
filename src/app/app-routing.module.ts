import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { EditTaskComponent } from './board/edit-task/edit-task.component';
import { HomeComponent } from './core/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'board', component: BoardComponent },
  { path: 'todo/edit/:todoId', component: EditTaskComponent },
  { path: 'doing/edit/:doingId', component: EditTaskComponent },
  { path: 'done/edit/:doneId', component: EditTaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
