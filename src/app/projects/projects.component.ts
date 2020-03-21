import { Component, OnInit } from '@angular/core';
import { ProjectHttpService } from './project-http.service';
import { Observable } from 'rxjs';
import { IProject } from './project.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProjectStateService } from './project-state.service';

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

  constructor(private projectStateService: ProjectStateService, private router: Router) {}

  ngOnInit() {
    this.projects$ = this.projectStateService.getMappedProjects();
  }

  /**
   * Navigate to project page.
   * @param url -> slugified name from API.
   */
  onViewProject(url: string) {
    this.router.navigateByUrl(`projects/${url}`);
  }
}
