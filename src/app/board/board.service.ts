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
  private todoUpdate = new BehaviorSubject<Task[]>(this.tasks);

  constructor(private http: HttpClient) {}

  getTodoUpdateListener() {
    return this.todoUpdate.asObservable();
  }

  /**
   * Create a new task
   */
  createTask(title: string, content: string) {
    const task: Task = { id: null, title, content };
    this.http
      .post<{ message: string; taskId: string }>(
        'http://localhost:3000/api/todo',
        task
      )
      .subscribe(response => {
        const id = response.taskId;
        task.id = id;
        this.tasks.push(task);
        this.todoUpdate.next([...this.tasks]);
      });
  }

  // Get todo tasks from server
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
}
