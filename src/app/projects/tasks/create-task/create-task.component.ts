import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskHttpService } from '../task-http.service';
import { TaskStateService } from '../task-state.service';
import { IProject } from '../../project.model';
import { Mode, ModalTaskTitle } from 'src/app/shared/enums';

/**
 * Dynamic component for creating new tasks
 */
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  public taskForm: FormGroup;
  public mode: Mode;
  public modalTitle: ModalTaskTitle;
  @Output() close = new EventEmitter<void>();
  private taskId: string;
  private project: IProject;
  private destroy$ = new Subject<void>();

  constructor(private taskHttpService: TaskHttpService, private taskStateService: TaskStateService) {}

  /**
   * Initialize task form.
   */
  ngOnInit(): void {
    this.taskForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]
      })
    });

    this.taskStateService.taskIdListener$.pipe(takeUntil(this.destroy$)).subscribe(id => (this.taskId = id));

    this.project = this.taskStateService.project;

    if (this.taskId) {
      this.mode = Mode.Edit;
      this.modalTitle = ModalTaskTitle.Edit;

      this.taskStateService
        .getMappedTask(this.project.url, this.taskId)
        .subscribe(task => this.taskForm.setValue({ title: task.title, description: task.description }));
    } else {
      this.mode = Mode.Create;
      this.modalTitle = ModalTaskTitle.Create;
    }
  }

  /**
   * Get title form control.
   */
  public get title(): AbstractControl {
    return this.taskForm.get('title');
  }

  /**
   * Get descriptipon form control.
   */
  public get description(): AbstractControl {
    return this.taskForm.get('description');
  }

  /**
   * Display title errors.
   */
  public getTitleErrors(): string {
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
  public getDescriptionErrors(): string {
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
  public onSave(): void {
    if (this.mode === 'create') {
      this.taskHttpService
        .createTask(this.project.url, (this.project as any)._id, {
          id: null,
          title: this.title.value,
          description: this.description.value
        })
        .subscribe(res => this.taskStateService.taskChange(res.body.task));
    } else if (this.mode === 'edit') {
      this.taskHttpService
        .updateTask(this.project.url, this.taskId, { title: this.title.value, description: this.description.value })
        .subscribe(res => this.taskStateService.taskChange(res.body.task));
    }

    this.taskForm.reset();
    this.onClose();
  }

  /**
   * Close modal.
   */
  public onClose(): void {
    this.close.emit();
  }

  /**
   * Unsubscribe from observables.
   * Set task id null.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.taskStateService.getTaskId(null);
  }
}
