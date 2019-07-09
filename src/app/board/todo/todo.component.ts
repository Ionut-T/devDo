import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { BoardService } from '../board.service';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { switchMap } from 'rxjs/operators';

/**
 * Todo List Component
 */
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  tasks: Task[];
  isOpen = false;
  private todoSubscription: Subscription;
  isLoading = false;
  private loadingSubscription: Subscription;
  private todoUpdate = new BehaviorSubject<Task[]>(this.tasks);
  tasks$ = this.todoUpdate.asObservable();
  // tasks$: Observable<Task[]>;

  constructor(
    private boardService: BoardService,
    private uiService: UIService
  ) {}

  /**
   * Get todo tasks
   */
  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => (this.isLoading = isLoading)
    );
    this.getTasks();

    // this.boardService.getTodoTasks().subscribe(response => {
    //   this.tasks = response;
    //   this.uiService.loadingStateChanged.next(false);
    //   this.todoUpdate.next([...this.tasks]);
    // });
    // this.todoSubscription = this.boardService
    //   .getTodoUpdateListener()
    //   .subscribe((tasks: Task[]) => {
    //     this.tasks = tasks;
    //   });
  }

  getTasks() {
    this.boardService.getTodoTasks().subscribe(tasks => {
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
    this.boardService.deleteTodoTask(id);
  }

  /**
   * Add task to doing list
   */
  onPushToDoing(id: string) {
    this.boardService.changeTaskStatus(id);
    // this.onDelete(id);
  }

  /**
   * Unsubscribe from subscriptions
   */
  ngOnDestroy() {
    if (this.todoSubscription) {
      this.todoSubscription.unsubscribe();
    }

    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
