import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, switchMap, finalize, share, tap } from 'rxjs/operators';
import { TaskHttpService } from './task-http.service';
import { TaskStateService } from './task-state.service';
import { ITask } from './task.model';
import { ActivatedRoute } from '@angular/router';
import { IProject } from '../project.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Status } from 'src/app/shared/enums';

/**
 * Tasks List Component.
 */
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public isLoading = false;
  public project: IProject;
  public tasks$: Observable<ITask[]>;
  public todoTasks$: Observable<ITask[]>;
  public doingTasks$: Observable<ITask[]>;
  public doneTasks$: Observable<ITask[]>;
  private forward = false;
  private backward = false;
  private destroy$ = new Subject<void>();

  constructor(
    private taskHttpService: TaskHttpService,
    private taskStateService: TaskStateService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.tasks$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('projectUrl')),
      switchMap(projectUrl =>
        this.taskStateService.taskOnChange$.pipe(
          switchMap(() =>
            this.taskStateService.getMappedTasks(projectUrl).pipe(
              finalize(() => (this.isLoading = false)),
              tap(() => (this.project = this.taskStateService.project))
            )
          )
        )
      ),
      share()
    );

    this.todoTasks$ = this.tasks$.pipe(map(tasks => tasks.filter(task => task.status === Status.Todo)));
    this.doingTasks$ = this.tasks$.pipe(map(tasks => tasks.filter(task => task.status === Status.Doing)));
    this.doneTasks$ = this.tasks$.pipe(map(tasks => tasks.filter(task => task.status === Status.Done)));
  }

  /**
   * Change status on forward.
   * @param id -> task id.
   */
  public onForward(id: string): void {
    this.backward = false;
    this.forward = true;
    this.onChangeStatus(id);
  }

  /**
   * Change status on backward.
   * @param id -> task id.
   */
  public onBackward(id: string): void {
    this.forward = false;
    this.backward = true;
    this.onChangeStatus(id);
  }

  /**
   * Change status.
   * @param id -> task id.
   */
  private onChangeStatus(id: string): void {
    this.taskStateService
      .getMappedTask(this.taskStateService.project.url, id)
      .pipe(
        switchMap(task => {
          let status: Status;
          if (this.forward) {
            status = task.status.includes(Status.Todo) ? Status.Doing : Status.Done;
          }
          if (this.backward) {
            status = task.status.includes(Status.Done) ? Status.Doing : Status.Todo;
          }
          return this.taskHttpService.updateTask(this.taskStateService.project.url, id, { status });
        })
      )
      .subscribe(res => this.taskStateService.taskChange(res.body.task));
  }

  /**
   * Delete task upon confirmation.
   * @param id -> task id.
   */
  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Delete Task', content: 'Are you sure you want to delete this task?' }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteTask(id);
        }
      });
  }

  /**
   * Delete task method.
   * @param id -> task id.
   */
  private deleteTask(id: string): void {
    this.taskHttpService
      .deleteTask(this.taskStateService.project.url, id)
      .subscribe(() => this.taskStateService.taskChange(null));
  }

  /**
   * Open/close modal.
   */
  public toggleModal(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Unsubscribe from observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
