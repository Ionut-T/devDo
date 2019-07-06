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
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private todoTasks: Task[] = [];
  private doingTasks: Task[] = [];
  private doneTasks: Task[] = [];
  private todoUpdate = new BehaviorSubject<Task[]>(this.todoTasks);
  private doingUpdate = new BehaviorSubject<Task[]>(this.doingTasks);
  private doneUpdate = new BehaviorSubject<Task[]>(this.doneTasks);

  constructor(private http: HttpClient, private uiService: UIService) {}

  /**
   * Listen to changes in todo list.
   */
  getTodoUpdateListener() {
    return this.todoUpdate.asObservable();
  }

  /**
   * Listen to changes in doing list.
   */
  getDoingUpdateListener() {
    return this.doingUpdate.asObservable();
  }

  /**
   * Listen to changes in done list.
   */
  getDoneUpdateListener() {
    return this.doneUpdate.asObservable();
  }

  /**
   * Create a new task.
   */
  addTodoTask(title: string, description: string) {
    const task: Task = { id: null, title, description };
    this.http
      .post<{
        message: string;
        task: { id: string; title: string; description: string };
      }>(`${BACKEND_URL}/todo`, task)
      .subscribe(response => {
        task.id = response.task.id;
        this.todoTasks.push(task);
        this.todoUpdate.next([...this.todoTasks]);
      });
  }

  /**
   * Get a single todo task from server.
   */
  getTodoTask(id: string) {
    return this.http.get<{ _id: string; title: string; description: string }>(
      `${BACKEND_URL}/todo/${id}`
    );
  }

  /**
   * Get todo tasks from server.
   */
  getTodoTasks() {
    this.uiService.loadingStateChanged.next(true);
    this.http
      .get<{ message: string; tasks: any }>(`${BACKEND_URL}/todo`)
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              id: task._id,
              title: task.title,
              description: task.description,
              creator: task.creator
            };
          });
        })
      )
      .subscribe(response => {
        this.todoTasks = response;
        this.uiService.loadingStateChanged.next(false);
        this.todoUpdate.next([...this.todoTasks]);
      });
  }

  /**
   * Update todo task.
   */
  updateTodoTask(id: string, title: string, description: string) {
    const task: Task = { id, title, description };
    this.http
      .put<{ message: string; task: Task }>(`${BACKEND_URL}/todo/${id}`, task)
      .subscribe(response => {
        const updatedTasks = [...this.todoTasks];
        const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.todoTasks = updatedTasks;
        this.todoUpdate.next([...this.todoTasks]);
      });
  }

  /**
   * Delete todo task from server.
   */
  deleteTodoTask(id: string) {
    this.http.delete(`${BACKEND_URL}/todo/${id}`).subscribe(() => {
      this.todoTasks = this.todoTasks.filter(task => task.id !== id);
      this.todoUpdate.next([...this.todoTasks]);
    });
  }

  /**
   * Add doing task.
   */
  addDoingTask(id: string, title: string, description: string) {
    const task: Task = { id, title, description };
    this.http
      .post<{
        message: string;
        task: { id: string; title: string; description: string };
      }>(`${BACKEND_URL}/doing`, task)
      .subscribe(response => {
        task.id = response.task.id;
        this.doingTasks.push(task);
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  /**
   * Get a single doing task from server.
   */
  getDoingTask(id: string) {
    return this.http.get<{ _id: string; title: string; description: string }>(
      `${BACKEND_URL}/doing/${id}`
    );
  }

  /**
   * Get all tasks in progress from server.
   */
  getDoingTasks() {
    this.uiService.loadingStateChanged.next(true);
    this.http
      .get<{ message: string; tasks: any }>(`${BACKEND_URL}/doing`)
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              id: task._id,
              title: task.title,
              description: task.description
            };
          });
        })
      )
      .subscribe(response => {
        this.doingTasks = response;
        this.uiService.loadingStateChanged.next(false);
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  /**
   * Update doing task.
   */
  updateDoingTask(id: string, title: string, description: string) {
    const task: Task = { id, title, description };
    this.http
      .put<{ message: string; task: Task }>(`${BACKEND_URL}/doing/${id}`, task)
      .subscribe(response => {
        const updatedTasks = [...this.doingTasks];
        const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.doingTasks = updatedTasks;
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  /**
   * Delete doing task.
   */
  deleteDoingTask(id: string) {
    this.http.delete(`${BACKEND_URL}/doing/${id}`).subscribe(() => {
      this.doingTasks = this.doingTasks.filter(task => task.id !== id);
      this.doingUpdate.next([...this.doingTasks]);
    });
  }

  /**
   * Add done task.
   */
  addDoneTask(id: string, title: string, description: string) {
    const task: Task = { id, title, description };
    this.http
      .post<{
        message: string;
        task: { id: string; title: string; description: string };
      }>(`${BACKEND_URL}/done`, task)
      .subscribe(response => {
        task.id = response.task.id;
        this.doneTasks.push(task);
        this.doneUpdate.next([...this.doneTasks]);
      });
  }

  /**
   * Get a single done task from server.
   */
  getDoneTask(id: string) {
    return this.http.get<{ _id: string; title: string; description: string }>(
      `${BACKEND_URL}/done/${id}`
    );
  }

  /**
   * Get all finished tasks from server.
   */
  getDoneTasks() {
    this.uiService.loadingStateChanged.next(true);
    this.http
      .get<{ message: string; tasks: any }>(`${BACKEND_URL}/done`)
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              id: task._id,
              title: task.title,
              description: task.description
            };
          });
        })
      )
      .subscribe(data => {
        this.doneTasks = data;
        this.uiService.loadingStateChanged.next(false);
        this.doneUpdate.next([...this.doneTasks]);
      });
  }

  /**
   * Update done task.
   */
  updateDoneTask(id: string, title: string, description: string) {
    const task: Task = { id, title, description };
    this.http
      .put<{ message: string; task: Task }>(`${BACKEND_URL}/done/${id}`, task)
      .subscribe(response => {
        const updatedTasks = [...this.doneTasks];
        const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.doneTasks = updatedTasks;
        this.doneUpdate.next([...this.doneTasks]);
      });
  }

  /**
   * Delete done task.
   */
  deleteDoneTask(id: string) {
    this.http.delete(`${BACKEND_URL}/done/${id}`).subscribe(() => {
      this.doneTasks = this.doneTasks.filter(task => task.id !== id);
      this.doneUpdate.next([...this.doneTasks]);
    });
  }
}
