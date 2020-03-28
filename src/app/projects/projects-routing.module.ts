import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: ':projectUrl', component: TasksComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
