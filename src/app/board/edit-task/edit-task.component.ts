import { Component, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { NgForm } from '@angular/forms';
import { BoardService } from '../board.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/**
 * Component for editing tasks
 */
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  task: Task;
  private taskId: string;
  private target = 'todo' || 'doing' || 'done';

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Fetch task content
   */
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('todoId')) {
        this.target = 'todo';
        this.taskId = paramMap.get('todoId');
        this.boardService.getTodoTask(this.taskId).subscribe(responseData => {
          this.task = {
            id: responseData._id,
            title: responseData.title,
            content: responseData.content
          };
        });
      } else if (paramMap.has('doingId')) {
        this.target = 'doing';
        this.taskId = paramMap.get('doingId');
        this.boardService.getDoingTask(this.taskId).subscribe(responseData => {
          this.task = {
            id: responseData._id,
            title: responseData.title,
            content: responseData.content
          };
        });
      } else {
        this.target = 'done';
        this.taskId = paramMap.get('doneId');
        this.boardService.getDoneTask(this.taskId).subscribe(responseData => {
          this.task = {
            id: responseData._id,
            title: responseData.title,
            content: responseData.content
          };
        });
      }
    });
  }

  /**
   * Save edited task
   */
  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.target === 'todo') {
      this.boardService.updateTodoTask(
        this.taskId,
        form.value.title,
        form.value.content
      );
    } else if (this.target === 'doing') {
      this.boardService.updateDoingTask(
        this.taskId,
        form.value.title,
        form.value.content
      );
    } else {
      this.boardService.updateDoneTask(
        this.taskId,
        form.value.title,
        form.value.content
      );
    }

    this.onClose();
  }

  /**
   * Return to board
   */
  onClose() {
    this.router.navigate(['/']);
  }
}
