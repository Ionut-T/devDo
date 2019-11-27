import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ITask } from './task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { environment } from '../../environments/environment';

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
   */
  createTask(task: ITask): Observable<TaskResponseType> {
    return this.http.post<{ task: ITask }>(`${this.URL}`, task, { observe: 'response' });
  }

  /**
   * Get a single task from server.
   */
  getTask(id: string) {
    return this.http.get<{ _id: string; title: string; description: string; status: 'todo' | 'doing' | 'done' }>(`${this.URL}/${id}`);
  }

  getTasks(): Observable<TaskArrayResponseType> {
    this.uiService.loadingStateChanged.next(true);
    return this.http.get<{ tasks: ITask[] }>(this.URL, { observe: 'response' });
  }

  /**
   * Update task.
   */
  updateTask(id: string, task: Partial<ITask>): Observable<TaskResponseType> {
    return this.http.put<{ task: ITask }>(`${this.URL}/${id}`, task, { observe: 'response' });
  }

  /**
   * Delete task from server.
   */
  deleteTask(id: string): Observable<HttpResponse<null>> {
    return this.http.delete<null>(`${this.URL}/${id}`, { observe: 'response' });
  }

  /**
   * Update tasks list.
   */
  updateTaskList(newTask: ITask) {
    this.taskState.next(newTask);
  }
}
