import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskHttpService } from './task-http.service';
import { ITask } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  private taskListener = new BehaviorSubject<ITask>(null);
  taskListener$ = this.taskListener.asObservable();
  private tasksListListener = new BehaviorSubject<ITask[]>(null);
  tasksListListener$ = this.tasksListListener.asObservable();
  private taskIdListener = new BehaviorSubject<string>(null);
  taskIdListener$ = this.taskIdListener.asObservable();

  constructor(private taskHttpService: TaskHttpService) {}

  /**
   * Map task.
   * @param id -> task id.
   * @returns observable.
   */
  getMappedTask(id: string): Observable<ITask> {
    return this.taskHttpService.getTask(id).pipe(
      map((res: any) => {
        return {
          id: res.body._id,
          title: res.body.title,
          description: res.body.description,
          status: res.body.status
        };
      })
    );
  }

  /**
   * Update tasks list.
   * @param task -> created task.
   */
  updateTasksList(task: ITask) {
    this.taskListener.next(task);
  }

  /**
   * Reload tasks.
   * @param tasks -> tasks list.
   */
  reloadTasks(tasks: ITask[]) {
    this.tasksListListener.next(tasks);
  }

  /**
   * Get task id.
   * @param id -> task id.
   */
  getTaskId(id: string) {
    this.taskIdListener.next(id);
  }
}
