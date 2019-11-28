import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITask } from '../../task.model';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-tasks-card-list',
  templateUrl: './tasks-card-list.component.html',
  styleUrls: ['./tasks-card-list.component.css']
})
export class TasksCardListComponent implements OnInit {
  @Input() tasks: ITask[];
  @Input() title: string;
  @Input() tooltip: string;
  @Output() delete = new EventEmitter<void>();
  @Output() changeStatus = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit() {}

  /**
   * Delete task.
   * @param id -> task id.
   */
  onDelete(id: string) {
    this.taskService.deleteTask(id).subscribe();
    this.delete.emit();
  }

  /**
   * Change status.
   * @param id -> task id.
   * @returns promise
   */
  async onChangeStatus(id: string): Promise<void> {
    try {
      const result = await this.taskService.getMappedTask(id).toPromise();
      let status: 'todo' | 'doing' | 'done';
      if (result.status.includes('todo')) {
        status = 'doing';
      } else if (result.status.includes('doing')) {
        status = 'done';
      }

      this.taskService.updateTask(id, { status }).subscribe();
      return this.changeStatus.emit();
    } catch (error) {
      return console.log(error.message);
    }
  }
}
