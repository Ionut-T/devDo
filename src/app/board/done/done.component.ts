import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from '../task.model';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit, OnDestroy {
  doneTasks: Task[];
  private doneSubscription: Subscription;

  constructor(private boardService: BoardService) {}

  /**
   * Get done tasks
   */
  ngOnInit() {
    this.boardService.getDoneTasks();
    this.doneSubscription = this.boardService
      .getDoneUpdateListener()
      .subscribe(tasks => {
        this.doneTasks = tasks;
      });
  }

  /**
   * Add task back to doing list
   */
  onUndo(id: string, title: string, content: string) {
    this.boardService.addDoingTask(id, title, content);
    this.onDelete(id);
  }

  /**
   * Delete doing task
   */
  onDelete(id: string) {
    this.boardService.deleteDoneTask(id);
  }

  /**
   * Unsubscribe from subscriptions
   */
  ngOnDestroy() {
    if (this.doneSubscription) {
      this.doneSubscription.unsubscribe();
    }
  }
}
