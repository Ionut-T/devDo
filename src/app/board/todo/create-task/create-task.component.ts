import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BoardService } from '../../board.service';
import { NgForm } from '@angular/forms';

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

  constructor(private boardService: BoardService) {}

  ngOnInit() {}

  /**
   * Create new task
   */
  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.boardService.createTask(form.value.title, form.value.description);
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
