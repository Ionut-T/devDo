import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { takeUntil } from 'rxjs/operators';

/**
 * Tasks List Component
 */
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[];
  isOpen = false;
  isLoading = false;
  private todoUpdate = new BehaviorSubject<Task[]>(this.tasks);
  tasks$ = this.todoUpdate.asObservable();
  // tasks$: Observable<Task[]>;
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, private uiService: UIService) {}

  /**
   * Get todo tasks
   */
  ngOnInit() {
    this.uiService.loadingStateChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => (this.isLoading = isLoading));
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.uiService.loadingStateChanged.next(false);
      this.todoUpdate.next([...this.tasks]);
    });
  }

  /**
   * Open Create Component
   */
  openCreate() {
    this.isOpen = true;
  }

  /**
   * Close Create Component
   */
  closeCreate() {
    this.isOpen = false;
  }

  /**
   * Delete todo task
   */
  onDelete(id: string) {
    this.taskService.deleteTodoTask(id);
  }

  /**
   * Add task to doing list
   */
  onPushToDoing(id: string) {
    // this.taskService.changeTaskStatus(id);
    // this.onDelete(id);
  }

  /**
   * Unsubscribe from subscriptions
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
