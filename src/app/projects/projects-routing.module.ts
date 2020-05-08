import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: ':projectUrl', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
