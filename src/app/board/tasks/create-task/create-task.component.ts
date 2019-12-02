import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../task.service';

/**
 * Dynamic component for creating new tasks
 */
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  mode: 'create' | 'edit';
  modalTitle: 'Create Task' | 'Edit Task';
  @Output() close = new EventEmitter<void>();
  private taskId: string;
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  /**
   * Initialize task form.
   */
  ngOnInit() {
    this.taskForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]
      })
    });

    this.taskService.taskIdListener$.pipe(takeUntil(this.destroy$)).subscribe(id => (this.taskId = id));

    if (this.taskId) {
      this.mode = 'edit';
      this.modalTitle = 'Edit Task';
      this.taskService
        .getMappedTask(this.taskId)
        .subscribe(task => this.taskForm.setValue({ title: task.title, description: task.description }));
    } else {
      this.mode = 'create';
      this.modalTitle = 'Create Task';
    }
  }

  /**
   * Get title form control.
   */
  get title(): AbstractControl {
    return this.taskForm.get('title');
  }

  /**
   * Get descriptipon form control.
   */
  get description(): AbstractControl {
    return this.taskForm.get('description');
  }

  /**
   * Display title errors.
   */
  getTitleErrors(): string {
    if (this.title.hasError('required')) {
      return 'You must add a title!';
    } else if (this.title.hasError('minlength')) {
      return 'The title must have minimum 3 characters';
    } else if (this.title.hasError('maxlength')) {
      return 'The title must have maximum 20 characters';
    }
  }

  /**
   * Display title errors.
   */
  getDescriptionErrors(): string {
    if (this.description.hasError('required')) {
      return 'You must add a description!';
    } else if (this.description.hasError('minlength')) {
      return 'The description must have minimum 3 characters';
    } else if (this.description.hasError('maxlength')) {
      return 'The description must have maximum 1000 characters';
    }
  }

  /**
   * Create or edit task.
   */
  onSave() {
    if (this.mode === 'create') {
      this.taskService
        .createTask({ id: null, title: this.title.value, description: this.description.value })
        .subscribe(res => this.taskService.updateTasksList(res.body.task));
    } else if (this.mode === 'edit') {
      this.taskService
        .updateTask(this.taskId, { title: this.title.value, description: this.description.value })
        .subscribe(res => this.taskService.updateTasksList(res.body.task));
    }

    this.taskForm.reset();
    this.onClose();
  }

  /**
   * Close modal.
   */
  onClose() {
    this.close.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();

    this.taskService.getTaskId(null);
  }
}
