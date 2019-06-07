import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { BoardService } from '../board.service';
import { Subscription } from 'rxjs';

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

  constructor(private boardService: BoardService) {}

  /**
   * Get todo tasks
   */
  ngOnInit() {
    this.boardService.getTodoTasks();
    this.todoSubscription = this.boardService
      .getTodoUpdateListener()
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
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
  onPushToDoing(id: string, title: string, content: string) {
    this.boardService.addDoingTask(id, title, content);
    this.onDelete(id);
  }

  /**
   * Unsubscribe from subscriptions
   */
  ngOnDestroy() {
    if (this.todoSubscription) {
      this.todoSubscription.unsubscribe();
    }
  }
}
