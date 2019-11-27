import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITask } from '../task.model';
import { TaskService } from '../task.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { takeUntil, finalize, map, switchMap, share, tap, startWith, shareReplay } from 'rxjs/operators';

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
  tasks$: Observable<ITask[]>;
  private task: ITask;
  private tasks: ITask[] = [];
  private tasksListener = new BehaviorSubject<ITask[]>(this.tasks);
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, private uiService: UIService) {}

  ngOnInit() {
    // this.uiService.loadingStateChanged
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(isLoading => (this.isLoading = isLoading));

    this.tasks$ = this.tasksListener.asObservable().pipe(
      switchMap(() => this.getTasks()),
      shareReplay()
    );

    this.getLastTask();
  }

  /**
   * Get tasks.
   */
  private getTasks(): Observable<ITask[]> {
    return this.taskService.getTasks().pipe(
      map(res => {
        return res.body.tasks.map((task: any) => {
          return {
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            creator: task.creator
          };
        });
      })
    );
  }

  /**
   * Get new task.
   */
  private getLastTask(): Subscription {
    return this.taskService.taskListener$.pipe(takeUntil(this.destroy$)).subscribe((newTask: ITask) => {
      this.tasks.push(newTask);
      this.tasksListener.next([...this.tasks]);
    });
  }

  /**
   * Open Create Component.
   */
  openCreate() {
    this.isOpen = true;
  }

  /**
   * Close Create Component.
   */
  closeCreate() {
    this.isOpen = false;
  }

  /**
   * Delete todo task.
   */
  onDelete(id: string) {
    this.taskService.deleteTask(id).subscribe(() => this.tasksListener.next([...this.tasks]));
  }

  /**
   * Add task to doing list.
   */
  onChangeStatus(id: string) {
    this.taskService
      .getTask(id)
      .pipe(
        map(res => {
          return {
            id: res._id,
            title: res.title,
            description: res.description,
            status: res.status
          };
        })
      )
      .subscribe(res => (this.task = res));
    
    console.log('TCL: TasksComponent -> onPushToDoing -> task', this.task);

    if (!this.task) {
      return;
    }

    let status: 'todo' | 'doing' | 'done';

    if (this.task.status.includes('todo')) {
      status = 'doing';
    } else if (this.task.status.includes('doing')) {
      status = 'done';
    }

    console.log('TCL: TasksComponent -> onPushToDoing -> status', status);
    this.taskService.updateTask(id, { status }).subscribe();
  }

  /**
   * Unsubscribe from observables.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
