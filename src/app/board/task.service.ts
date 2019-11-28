import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ITask } from './task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

type TaskResponseType = HttpResponse<{ task: ITask }>;
type TaskArrayResponseType = HttpResponse<{ tasks: ITask[] }>;

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly URL = environment.apiUrl + '/tasks';
  private taskState = new BehaviorSubject<ITask>(null);
  taskListener$ = this.taskState.asObservable();

  constructor(private http: HttpClient, private uiService: UIService) {}

  /**
   * Create a new task.
   * @param task -> created task
   * @returns observable.
   */
  createTask(task: ITask): Observable<TaskResponseType> {
    return this.http.post<{ task: ITask }>(`${this.URL}`, task, { observe: 'response' });
  }

  /**
   * Create a new task.
   * @param task -> created task.
   * @returns observable.
   */
  getTasks(): Observable<TaskArrayResponseType> {
    this.uiService.loadingStateChanged.next(true);
    return this.http.get<{ tasks: ITask[] }>(this.URL, { observe: 'response' });
  }

  /**
   * Update task.
   * @param id -> task id.
   * @param task -> Partial task.
   * @returns observable.
   */
  updateTask(id: string, task: Partial<ITask>): Observable<TaskResponseType> {
    return this.http.put<{ task: ITask }>(`${this.URL}/${id}`, task, { observe: 'response' });
  }

  /**
   * Delete task from server.
   * @param id -> task id.
   * @returns observable.
   */
  deleteTask(id: string): Observable<HttpResponse<null>> {
    return this.http.delete<null>(`${this.URL}/${id}`, { observe: 'response' });
  }

  /**
   * Map task.
   * @param id -> task id.
   * @returns observable.
   */
  getMappedTask(id: string): Observable<ITask> {
    return this.getTask(id).pipe(
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
   * Get a single task from server.
   * @param id -> task id.
   * @returns observable.
   */
  private getTask(id: string): Observable<TaskResponseType> {
    return this.http.get<{ task: ITask }>(`${this.URL}/${id}`, { observe: 'response' });
  }

  /**
   * Update tasks list.
   * @param newTask -> created task.
   */
  updateTaskList(newTask: ITask) {
    this.taskState.next(newTask);
  }
}
