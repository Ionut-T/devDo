import { Component, Input } from '@angular/core';
import { ITask } from '../../task.model';
import { TaskService } from '../../task.service';
import { UIService } from '../../../shared/ui.service';

@Component({
  selector: 'app-tasks-card-list',
  templateUrl: './tasks-card-list.component.html',
  styleUrls: ['./tasks-card-list.component.css']
})
export class TasksCardListComponent {
  @Input() tasks: ITask[];
  @Input() title: string;
  @Input() forwardTooltip: string;
  @Input() backTooltip: string;
  @Input() isLoading: boolean;
  private forward = false;
  private backward = false;

  constructor(private taskService: TaskService, private uiService: UIService) {}

  /**
   * Delete task.
   * @param id -> task id.
   */
  onDelete(id: string) {
    this.taskService.deleteTask(id).subscribe(() => this.taskService.reloadTasks([...this.tasks]));
  }

  /**
   * Change status on forward.
   * @param id -> task id.
   */
  onForward(id: string) {
    this.backward = false;
    this.forward = true;
    this.onChangeStatus(id);
  }

  /**
   * Change status on backward.
   * @param id -> task id.
   */
  onBackward(id: string) {
    this.forward = false;
    this.backward = true;
    this.onChangeStatus(id);
  }

  /**
   * Change status.
   * @param id -> task id.
   * @returns promise
   */
  private async onChangeStatus(id: string): Promise<void> {
    try {
      const task = await this.taskService.getMappedTask(id).toPromise();

      let status: 'todo' | 'doing' | 'done';

      if (this.forward) {
        status = task.status.includes('todo') ? 'doing' : 'done';
      }

      if (this.backward) {
        status = task.status.includes('done') ? 'doing' : 'todo';
      }

      this.taskService.updateTask(id, { status }).subscribe(res => this.taskService.updateTasksList(res.body.task));
    } catch (error) {
      this.uiService.showSnackBar('Something went wrong! Try again later.', null, 5000, 'top');
    }
  }
}
