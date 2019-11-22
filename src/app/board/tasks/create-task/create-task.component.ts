import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
export class CreateTaskComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit() {}

  /**
   * Create new task
   */
  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.taskService.createTask(form.value.title, form.value.description);
    form.resetForm();
    this.onClose();
  }

  /**
   * Close modal
   */
  onClose() {
    this.close.emit();
  }
}
