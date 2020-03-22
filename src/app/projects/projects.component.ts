import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectHttpService } from './project-http.service';
import { Observable, Subject } from 'rxjs';
import { IProject } from './project.model';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProjectStateService } from './project-state.service';
import { UIService } from '../shared/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

/**
 * Board Component
 */
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  isOpen = false;
  projects$: Observable<IProject[]>;
  private destroy$ = new Subject<null>();

  constructor(
    private projectHttpService: ProjectHttpService,
    private projectStateService: ProjectStateService,
    private router: Router,
    private dialog: MatDialog,
    private uiService: UIService
  ) {}

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

  /**
   * Delete project upon confirmation.
   * @param id -> project id.
   * @param name -> project name.
   */
  onDelete(name: string, id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Delete Project "${name.toUpperCase()}"`,
        content: 'Are you sure you want to delete this project?'
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteProject(id);
        }
      });
  }

  /**
   * Delete project method.
   * @param id -> project id.
   */
  deleteProject(id: string) {
    this.projectHttpService.deleteProject(id).subscribe();
  }

  /**
   * Unsubscribe from observables.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
