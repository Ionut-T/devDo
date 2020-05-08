import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITask } from '../task.model';
import { TaskStateService } from '../task-state.service';

@Component({
  selector: 'app-tasks-card-list',
  templateUrl: './tasks-card-list.component.html',
  styleUrls: ['./tasks-card-list.component.scss']
})
export class TasksCardListComponent {
  @Input() tasks: ITask[];
  @Input() title: string;
  @Input() forwardTooltip: string;
  @Input() backTooltip: string;
  @Input() isLoading: boolean;
  @Output() edit = new EventEmitter<void>();
  @Output() forward = new EventEmitter<string>();
  @Output() backward = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  constructor(private taskStateService: TaskStateService) {}

  public onEdit(id: string): void {
    this.taskStateService.getTaskId(id);
    this.edit.emit();
  }

  public onForward(id: string): void {
    this.forward.emit(id);
  }

  public onBackward(id: string): void {
    this.backward.emit(id);
  }

  public onDelete(id: string): void {
    this.delete.emit(id);
  }
}
