import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, map, switchMap, finalize, share, tap } from 'rxjs/operators';
import { TaskHttpService } from './task-http.service';
import { TaskStateService } from './task-state.service';
import { ITask } from './task.model';
import { ActivatedRoute } from '@angular/router';
import { IProject } from '../project.model';

/**
 * Tasks List Component
 */
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  isOpen = false;
  isLoading = false;
  project: IProject;
  todoTasks$: Observable<ITask[]>;
  doingTasks$: Observable<ITask[]>;
  doneTasks$: Observable<ITask[]>;
  private tasks: ITask[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private taskHttpService: TaskHttpService,
    private taskStateService: TaskStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;

    const tasks$ = this.taskStateService.tasksListListener$.pipe(
      switchMap(() => this.tasks$),
      share()
    );

    this.todoTasks$ = tasks$.pipe(map(tasks => tasks.filter(task => task.status.includes('todo'))));
    this.doingTasks$ = tasks$.pipe(map(tasks => tasks.filter(task => task.status.includes('doing'))));
    this.doneTasks$ = tasks$.pipe(map(tasks => tasks.filter(task => task.status.includes('done'))));

    this.getUpdatedTasksList();
  }

  /**
   * Get tasks.
   */
  private get tasks$(): Observable<ITask[]> {
    return this.route.paramMap.pipe(
      switchMap(paramMap =>
        this.taskHttpService.getTasks(paramMap.get('projectUrl')).pipe(
          finalize(() => (this.isLoading = false)),
          tap(res => (this.project = res.body.project)),
          map(res =>
            res.body.tasks.map((task: any) => ({
              id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              creator: task.creator
            }))
          )
        )
      )
    );
  }

  /**
   * Get new task.
   */
  private getUpdatedTasksList(): Subscription {
    return this.taskStateService.taskListener$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.taskStateService.reloadTasks([...this.tasks]));
  }

  /**
   * Open/close modal.
   */
  toggleModal() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Unsubscribe from observables.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
