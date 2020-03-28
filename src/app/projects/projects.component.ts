import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectHttpService } from './project-http.service';
import { Observable, Subject } from 'rxjs';
import { IProject } from './project.model';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProjectStateService } from './project-state.service';
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
  public isOpen = false;
  public projects$: Observable<IProject[]>;
  private destroy$ = new Subject<null>();

  projects: IProject[] = [];
  deletedId: string;

  constructor(
    private projectHttpService: ProjectHttpService,
    private projectStateService: ProjectStateService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projects$ = this.projectStateService.projectOnChange$.pipe(
      switchMap(() => this.projectStateService.getMappedProjects())
    );
  }

  /**
   * Navigate to project page.
   * @param url -> slugified name from API.
   */
  public onViewProject(url: string): void {
    this.router.navigateByUrl(`projects/${url}`);
  }

  /**
   * Retrieve project id and open modal.
   */
  public onEdit(id: string): void {
    this.isOpen = true;
    this.projectStateService.getProjectId(id);
  }

  /**
   * Delete project upon confirmation.
   * @param id -> project id.
   * @param name -> project name.
   */
  public onDelete(name: string, id: string): void {
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
  public deleteProject(id: string): void {
    this.projectHttpService.deleteProject(id).subscribe(() => this.projectStateService.projectChange(null));
  }

  /**
   * Close modal.
   */
  public closeModal(): void {
    this.isOpen = false;
    this.projectStateService.getProjectId(null);
  }

  /**
   * Unsubscribe from observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
