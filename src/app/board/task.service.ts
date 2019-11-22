import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from './task.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { environment } from '../../environments/environment';

/**
 * API URL
 */
const API_URL = environment.apiUrl + '/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient, private uiService: UIService) {}

  /**
   * Create a new task.
   */
  createTask(title: string, description: string) {
    const task: Task = { id: null, title, description };
    return this.http.post<{
      message: string;
      data: { task: { id: string; title: string; description: string } };
    }>(`${API_URL}`, task);
  }

  /**
   * Get a single task from server.
   */
  getTask(id: string) {
    return this.http.get<{
      task: { _id: string; title: string; description: string; status: string };
    }>(`${API_URL}/${id}`);
  }

  getTasks() {
    this.uiService.loadingStateChanged.next(true);
    return this.http.get<{ message: string; data: { tasks: any } }>(`${API_URL}/todo`).pipe(
      map(taskData => {
        return taskData.data.tasks.map(task => {
          return {
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            creator: task.creator
          };
        });
      })
    );
  }

  /**
   * Update task.
   */
  updateTask(id: string, title: string, description: string) {
    const task: Task = { id, title, description };
    return this.http.put<{ task: Task }>(`${API_URL}/${id}`, task);
  }

  /**
   * Delete task from server.
   */
  deleteTodoTask(id: string) {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
