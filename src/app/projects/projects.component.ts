import { Component, OnInit } from '@angular/core';
import { ProjectHttpService } from './project-http.service';

/**
 * Board Component
 */
@Component({
  selector: 'app-board',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  isOpen = false;

  constructor(private projectHttpService: ProjectHttpService) {}

  ngOnInit() {
    this.projectHttpService.getProjects().subscribe(console.log);
  }
}
