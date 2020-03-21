import { Component, OnInit } from '@angular/core';
import { ProjectHttpService } from './project-http.service';
import { Observable } from 'rxjs';
import { IProject } from './project.model';
import { map } from 'rxjs/operators';

/**
 * Board Component
 */
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  isOpen = false;
  projects$: Observable<IProject[]>;

  constructor(private projectHttpService: ProjectHttpService) {}

  ngOnInit() {
    this.projects$ = this.projectHttpService.getProjects().pipe(map(response => response.body.projects));
  }
}
