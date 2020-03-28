import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { ITask } from './task.model';
import { Observable } from 'rxjs';
import { UIService } from '../../shared/ui.service';
import { environment } from '../../../environments/environment';
import { IProject } from '../project.model';

type TaskResponseType = HttpResponse<{ task: ITask }>;
type TaskArrayResponseType = HttpResponse<{ tasks: ITask[]; project: IProject }>;

@Injectable({
  providedIn: 'root'
})
export class TaskHttpService {
  private readonly URL = environment.apiUrl + '/projects';

  constructor(private http: HttpClient, private uiService: UIService) {}

  /**
   * Create a new task.
   * @param task -> created task
   * @returns observable.
   */
  public createTask(projectUrl: string, projectId: string, task: ITask): Observable<TaskResponseType> {
    return this.http.post<{ task: ITask }>(`${this.URL}/${projectUrl}/tasks`, task, {
      observe: 'response',
      params: new HttpParams().set('projectId', projectId)
    });
  }

  /**
   * Create a new task.
   * @param task -> created task.
   * @returns observable.
   */
  public getTasks(projectUrl: string): Observable<TaskArrayResponseType> {
    this.uiService.loadingStateChanged.next(true);

    return this.http.get<{ tasks: ITask[]; project: IProject }>(`${this.URL}/${projectUrl}/tasks`, {
      observe: 'response'
    });
  }

  /**
   * Update task.
   * @param id -> task id.
   * @param task -> Partial task.
   * @returns observable.
   */
  public updateTask(projectUrl: string, id: string, task: Partial<ITask>): Observable<TaskResponseType> {
    return this.http.put<{ task: ITask }>(`${this.URL}/${projectUrl}/tasks/${id}`, task, { observe: 'response' });
  }

  /**
   * Delete task from server.
   * @param id -> task id.
   * @returns observable.
   */
  public deleteTask(projectUrl: string, id: string): Observable<HttpResponse<null>> {
    return this.http.delete<null>(`${this.URL}/${projectUrl}/tasks/${id}`, { observe: 'response' });
  }

  /**
   * Get a single task from server.
   * @param id -> task id.
   * @returns observable.
   */
  public getTask(projectUrl: string, id: string): Observable<TaskResponseType> {
    return this.http.get<{ task: ITask }>(`${this.URL}/${projectUrl}/tasks/${id}`, { observe: 'response' });
  }
}
