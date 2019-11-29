import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from '../../task.service';

/**
 * Dynamic component for creating new tasks
 */
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  /**
   * Create new task.
   */
  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.taskService
      .createTask({ id: null, title: form.value.title, description: form.value.description })
      .subscribe(res => this.taskService.updateTasksList(res.body.task));

    form.resetForm();
    this.onClose();
  }

  /**
   * Close modal.
   */
  onClose() {
    this.close.emit();
  }
}
