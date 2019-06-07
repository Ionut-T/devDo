import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { BoardService } from '../board.service';
import { Subscription } from 'rxjs';

/**
 * Doing List Component
 */
@Component({
  selector: 'app-doing',
  templateUrl: './doing.component.html',
  styleUrls: ['./doing.component.css']
})
export class DoingComponent implements OnInit, OnDestroy {
  doingTasks: Task[];
  private doingSubscription: Subscription;

  constructor(private boardService: BoardService) {}

  /**
   * Get doing tasks
   */
  ngOnInit() {
    this.boardService.getDoingTasks();
    this.doingSubscription = this.boardService
      .getDoingUpdateListener()
      .subscribe(tasks => {
        this.doingTasks = tasks;
      });
  }

  /**
   * Add task to done list
   */
  onPushToDone(id: string, title: string, content: string) {
    this.boardService.addDoneTask(id, title, content);
    this.onDelete(id);
  }

  /**
   * Add task back to todo list
   */
  onUndo(id: string, title: string, content: string) {
    this.boardService.addTodoTask(title, content);
    this.onDelete(id);
  }

  /**
   * Delete doing task
   */
  onDelete(id: string) {
    this.boardService.deleteDoingTask(id);
  }

  /**
   * Unsubscribe from subscriptions
   */
  ngOnDestroy() {
    if (this.doingSubscription) {
      this.doingSubscription.unsubscribe();
    }
  }
}
