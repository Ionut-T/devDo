import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ITask } from '../../task.model';
import { TaskService } from '../../task.service';
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
  task: ITask;
  private taskId: string;
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  /**
   * Fetch task content.
   */
  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.taskId = paramMap.get('taskId');
      }
    });

    this.taskService.getMappedTask(this.taskId).subscribe(task => {
      this.task = { id: task.id, title: task.title, description: task.description };
    });
  }

  /**
   * Save edited task.
   */
  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.taskService
      .updateTask(this.taskId, { title: form.value.title, description: form.value.description })
      .subscribe();

    this.onClose();
  }

  /**
   * Return to board.
   */
  onClose() {
    this.router.navigate(['/board']);
  }

  /**
   * Unsubscribe from observables.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
