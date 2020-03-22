import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ITask } from '../task.model';
import { UIService } from '../../../shared/ui.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { TaskHttpService } from '../task-http.service';
import { TaskStateService } from '../task-state.service';

@Component({
  selector: 'app-tasks-card-list',
  templateUrl: './tasks-card-list.component.html',
  styleUrls: ['./tasks-card-list.component.css']
})
export class TasksCardListComponent implements OnDestroy {
  @Input() tasks: ITask[];
  @Input() title: string;
  @Input() forwardTooltip: string;
  @Input() backTooltip: string;
  @Input() isLoading: boolean;
  @Output() edit = new EventEmitter<void>();
  private forward = false;
  private backward = false;
  private destroy$ = new Subject<void>();

  constructor(
    private taskHttpService: TaskHttpService,
    private taskStateService: TaskStateService,
    private uiService: UIService,
    private dialog: MatDialog
  ) {}

  onEdit(id: string) {
    this.taskStateService.getTaskId(id);
    this.edit.emit();
  }

  /**
   * Delete task upon confirmation.
   * @param id -> task id.
   */
  onDelete(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Delete Task', content: 'Are you sure you want to delete this task?' }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteTask(id);
        }
      });
  }

  /**
   * Delete task method.
   * @param id -> task id.
   */
  private deleteTask(id: string) {
    this.taskHttpService.deleteTask(id).subscribe(() => this.taskStateService.reloadTasks([...this.tasks]));
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
      const task = await this.taskStateService.getMappedTask(id).toPromise();

      let status: 'todo' | 'doing' | 'done';

      if (this.forward) {
        status = task.status.includes('todo') ? 'doing' : 'done';
      }

      if (this.backward) {
        status = task.status.includes('done') ? 'doing' : 'todo';
      }

      this.taskHttpService
        .updateTask(id, { status })
        .subscribe(res => this.taskStateService.updateTasksList(res.body.task));
    } catch (error) {
      this.uiService.showSnackBar('Something went wrong! Try again later.', null, 5000, 'top');
    }
  }

  /**
   * Unsubscribe from observables.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
