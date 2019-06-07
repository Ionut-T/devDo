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
        console.log(task.id);
      });
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
      .subscribe(data => {
        this.tasks = data;
        this.todoUpdate.next([...this.tasks]);
      });
  }

  /**
   * Delete todo task from server
   */
  deleteTodoTask(taskId: string) {
    this.http
      .delete(`http://localhost:3000/api/todo/${taskId}`)
      .subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.todoUpdate.next([...this.tasks]);
      });
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
      .subscribe(data => {
        this.doingTasks = data;
        this.doingUpdate.next([...this.doingTasks]);
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
        console.log(task.id);
      });
  }

  /**
   * Delete doing task
   */
  deleteDoingTask(taskId: string) {
    this.http
      .delete(`http://localhost:3000/api/doing/${taskId}`)
      .subscribe(() => {
        this.doingTasks = this.doingTasks.filter(task => task.id !== taskId);
        this.doingUpdate.next([...this.doingTasks]);
      });
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
   * Add doing task
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
        console.log(task.id);
      });
  }

  /**
   * Delete doing task
   */
  deleteDoneTask(taskId: string) {
    this.http
      .delete(`http://localhost:3000/api/done/${taskId}`)
      .subscribe(() => {
        this.doneTasks = this.doneTasks.filter(task => task.id !== taskId);
        this.doneUpdate.next([...this.doneTasks]);
      });
  }
}
