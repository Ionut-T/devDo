import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TaskHttpService } from './task-http.service';
import { ITask } from './task.model';
import { IProject } from '../project.model';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  private taskChanged = new BehaviorSubject<ITask | null>(null);
  public taskOnChange$ = this.taskChanged.asObservable();
  private taskIdListener = new BehaviorSubject<string>(null);
  public taskIdListener$ = this.taskIdListener.asObservable();
  public project: IProject;

  constructor(private taskHttpService: TaskHttpService) {}

  /**
   * Map task.
   * @param id -> task id.
   * @returns observable.
   */
  public getMappedTask(projectUrl: string, id: string): Observable<ITask> {
    return this.taskHttpService.getTask(projectUrl, id).pipe(
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

  public getMappedTasks(projectUrl: string): Observable<ITask[]> {
    return this.taskHttpService.getTasks(projectUrl).pipe(
      tap(res => (this.project = res.body.project)),
      map(res =>
        res.body.tasks.map((task: any) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          creator: task.creator
        }))
      )
    );
  }

  /**
   * Update tasks list.
   * @param task -> created task.
   */
  public taskChange(task: ITask): void {
    this.taskChanged.next(task);
  }

  /**
   * Get task id.
   * @param id -> task id.
   */
  public getTaskId(id: string): void {
    this.taskIdListener.next(id);
  }
}
