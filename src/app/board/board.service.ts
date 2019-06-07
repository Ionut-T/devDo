import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from './task.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private tasks: Task[] = [];
  private doingTasks: Task[] = [];
  private doneTasks: Task[] = [];
  private todoUpdate = new BehaviorSubject<Task[]>(this.tasks);
  private doingUpdate = new BehaviorSubject<Task[]>(this.doingTasks);
  private doneUpdate = new BehaviorSubject<Task[]>(this.doneTasks);

  constructor(private http: HttpClient) {}

  /**
   * Listen to changes in todo list
   */
  getTodoUpdateListener() {
    return this.todoUpdate.asObservable();
  }

  /**
   * Listen to changes in doing list
   */
  getDoingUpdateListener() {
    return this.doingUpdate.asObservable();
  }

  /**
   * Listen to changes in done list
   */
  getDoneUpdateListener() {
    return this.doneUpdate.asObservable();
  }

  /**
   * Create a new task
   */
  addTodoTask(title: string, content: string) {
    const task: Task = { id: null, title, content };
    this.http
      .post<{
        message: string;
        task: { id: string; title: string; content: string };
      }>('http://localhost:3000/api/todo', task)
      .subscribe(response => {
        task.id = response.task.id;
        this.tasks.push(task);
        this.todoUpdate.next([...this.tasks]);
      });
  }

  /**
   * Get a single todo task from server
   */
  getTodoTask(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      `http://localhost:3000/api/todo/${id}`
    );
  }

  /**
   * Get todo tasks from server
   */
  getTodoTasks() {
    this.http
      .get<{ message: string; tasks: any }>('http://localhost:3000/api/todo')
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              id: task._id,
              title: task.title,
              content: task.content
            };
          });
        })
      )
      .subscribe(response => {
        this.tasks = response;
        this.todoUpdate.next([...this.tasks]);
      });
  }

  /**
   * Update todo task
   */
  updateTodoTask(id: string, title: string, content: string) {
    const task: Task = { id, title, content };
    this.http
      .put<{ message: string; task: Task }>(
        `http://localhost:3000/api/todo/${id}`,
        task
      )
      .subscribe(response => {
        const updatedTasks = [...this.tasks];
        const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.tasks = updatedTasks;
        this.todoUpdate.next([...this.tasks]);
      });
  }

  /**
   * Delete todo task from server
   */
  deleteTodoTask(id: string) {
    this.http
      .delete(`http://localhost:3000/api/todo/${id}`)
      .subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.todoUpdate.next([...this.tasks]);
      });
  }

  /**
   * Add doing task
   */
  addDoingTask(id: string, title: string, content: string) {
    const task: Task = { id, title, content };
    this.http
      .post<{
        message: string;
        task: { id: string; title: string; content: string };
      }>('http://localhost:3000/api/doing', task)
      .subscribe(response => {
        task.id = response.task.id;
        this.doingTasks.push(task);
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  /**
   * Get a single doing task from server
   */
  getDoingTask(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      `http://localhost:3000/api/doing/${id}`
    );
  }

  /**
   * Get all tasks in progress from server
   */
  getDoingTasks() {
    this.http
      .get<{ message: string; tasks: any }>('http://localhost:3000/api/doing')
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              id: task._id,
              title: task.title,
              content: task.content
            };
          });
        })
      )
      .subscribe(response => {
        this.doingTasks = response;
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  /**
   * Update doing task
   */
  updateDoingTask(id: string, title: string, content: string) {
    const task: Task = { id, title, content };
    this.http
      .put<{ message: string; task: Task }>(
        `http://localhost:3000/api/doing/${id}`,
        task
      )
      .subscribe(response => {
        const updatedTasks = [...this.doingTasks];
        const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.doingTasks = updatedTasks;
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  /**
   * Delete doing task
   */
  deleteDoingTask(id: string) {
    this.http
      .delete(`http://localhost:3000/api/doing/${id}`)
      .subscribe(() => {
        this.doingTasks = this.doingTasks.filter(task => task.id !== id);
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  /**
   * Add done task
   */
  addDoneTask(id: string, title: string, content: string) {
    const task: Task = { id, title, content };
    this.http
      .post<{
        message: string;
        task: { id: string; title: string; content: string };
      }>('http://localhost:3000/api/done', task)
      .subscribe(response => {
        task.id = response.task.id;
        this.doneTasks.push(task);
        this.doneUpdate.next([...this.doneTasks]);
      });
  }

  /**
   * Get a single done task from server
   */
  getDoneTask(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      `http://localhost:3000/api/done/${id}`
    );
  }

  /**
   * Get all finished tasks from server
   */
  getDoneTasks() {
    this.http
      .get<{ message: string; tasks: any }>('http://localhost:3000/api/done')
      .pipe(
        map(taskData => {
          return taskData.tasks.map(task => {
            return {
              id: task._id,
              title: task.title,
              content: task.content
            };
          });
        })
      )
      .subscribe(data => {
        this.doneTasks = data;
        this.doneUpdate.next([...this.doneTasks]);
      });
  }

  /**
   * Update done task
   */
  updateDoneTask(id: string, title: string, content: string) {
    const task: Task = { id, title, content };
    this.http
      .put<{ message: string; task: Task }>(
        `http://localhost:3000/api/done/${id}`,
        task
      )
      .subscribe(response => {
        const updatedTasks = [...this.doneTasks];
        const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.doneTasks = updatedTasks;
        this.doneUpdate.next([...this.doneTasks]);
      });
  }

  /**
   * Delete doing task
   */
  deleteDoneTask(id: string) {
    this.http.delete(`http://localhost:3000/api/done/${id}`).subscribe(() => {
      this.doneTasks = this.doneTasks.filter(task => task.id !== id);
      this.doneUpdate.next([...this.doneTasks]);
    });
  }
}
