import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Component for editing tasks
 */
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {
  task: Task;
  private taskId: string;
  private target = 'todo' || 'doing' || 'done';
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  /**
   * Fetch task content
   */
  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap: ParamMap) => {
      if (paramMap.has('todoId')) {
        this.target = 'todo';
        this.taskId = paramMap.get('todoId');
        this.taskService.getTask(this.taskId).subscribe(responseData => {
          this.task = {
            id: responseData.task._id,
            title: responseData.task.title,
            description: responseData.task.description
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

    this.taskService.updateTask(this.taskId, form.value.title, form.value.description);

    this.onClose();
  }

  /**
   * Return to board
   */
  onClose() {
    this.router.navigate(['/board']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
