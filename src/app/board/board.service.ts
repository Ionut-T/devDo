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
export class BoardService {
  private task: Task;
  private tasks: Task[];
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
  createTask(title: string, description: string) {
    const task: Task = { id: null, title, description };
    this.http
      .post<{
        message: string;
        data: { task: { id: string; title: string; description: string } };
      }>(`${API_URL}`, task)
      .subscribe(response => {
        task.id = response.data.task.id;
        this.todoTasks.push(task);
        this.todoUpdate.next([...this.todoTasks]);
      });
  }

  /**
   * Get a single todo task from server.
   */
  getTodoTask(id: string) {
    return this.http.get<{
      task: { _id: string; title: string; description: string; status: string };
    }>(`${API_URL}/${id}`);
  }

  /**
   * Get todo tasks from server.
   */
  // getTasks() {
  //   this.uiService.loadingStateChanged.next(true);
  //   this.http
  //     .get<{ message: string; data: { tasks: any } }>(`${API_URL}`)
  //     .pipe(
  //       map(taskData => {
  //         return taskData.data.tasks.map(task => {
  //           return {
  //             id: task._id,
  //             title: task.title,
  //             description: task.description,
  //             status: task.status,
  //             creator: task.creator
  //           };
  //         });
  //       })
  //     )
  //     .subscribe(response => {
  //       response.forEach(task => {
  //         if (task) {
  //           if (task.status === 'todo') {
  //             // this.todoTasks.push(task);
  //             // tslint:disable-next-line: no-string-literal
  //             this.todoTasks = response.status['todo'];
  //             this.uiService.loadingStateChanged.next(false);
  //             this.todoUpdate.next([...this.todoTasks]);
  //           } else if (task.status === 'doing') {
  //             // this.doingTasks.push(task);
  //             // tslint:disable-next-line: no-string-literal
  //             this.doingTasks = response.status['doing'];
  //             this.uiService.loadingStateChanged.next(false);
  //             this.doingUpdate.next([...this.doingTasks]);
  //           } else if (task.status === 'done') {
  //             // this.doneTasks.push(task);
  //             // tslint:disable-next-line: no-string-literal
  //             this.doingTasks = response.status['done'];
  //             this.uiService.loadingStateChanged.next(false);
  //             this.doneUpdate.next([...this.doneTasks]);
  //           }
  //         }
  //       });
  //       this.uiService.loadingStateChanged.next(false);
  //     });
  // }

  getTodoTasks() {
    this.uiService.loadingStateChanged.next(true);
    return this.http
      .get<{ message: string; data: { tasks: any } }>(`${API_URL}/todo`)
      .pipe(
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
    // .subscribe(response => {
    //   this.todoTasks = response;
    //   this.uiService.loadingStateChanged.next(false);
    //   this.todoUpdate.next([...this.todoTasks]);
    // });
  }

  getDoingTasks() {
    this.uiService.loadingStateChanged.next(true);
    this.http
      .get<{ message: string; data: { tasks: any } }>(`${API_URL}/doing`)
      .pipe(
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
      )
      .subscribe(response => {
        this.doingTasks = response;
        this.uiService.loadingStateChanged.next(false);
        this.doingUpdate.next([...this.doingTasks]);
      });
  }

  getDoneTasks() {
    this.uiService.loadingStateChanged.next(true);
    this.http
      .get<{ message: string; data: { tasks: any } }>(`${API_URL}/done`)
      .pipe(
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
      )
      .subscribe(response => {
        this.doneTasks = response;
        this.uiService.loadingStateChanged.next(false);
        this.doneUpdate.next([...this.doneTasks]);
      });
  }

  /**
   * Update todo task.
   */
  updateTodoTask(id: string, title: string, description: string) {
    const task: Task = { id, title, description };
    this.http
      .patch<{ task: Task }>(`${API_URL}/${id}`, task)
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
    this.http.delete(`${API_URL}/${id}`).subscribe(() => {
      this.todoTasks = this.todoTasks.filter(task => task.id !== id);
      this.todoUpdate.next([...this.todoTasks]);
    });
  }

  /**
   * Change task's status
   */
  changeTaskStatus(id: string) {
    this.http
      .patch<{
        data: {
          task: { id: string; title: string; description: string; status: any };
        };
      }>(`${API_URL}/move-task/${id}`, status)
      .subscribe(response => {
        const task: Task = response.data.task;
        if (task.status === 'doing') {
          this.doingTasks.push(task);
          this.todoUpdate.next([...this.todoTasks]);
          this.doingUpdate.next([...this.doingTasks]);
          // this.getTodoTasks();
          // this.getDoingTasks();
        } else if (task.status === 'done') {
          this.doneTasks.push(task);
          this.doingUpdate.next([...this.doingTasks]);
          this.doneUpdate.next([...this.doneTasks]);
          // this.getDoingTasks();
          // this.getDoneTasks();
        }
      });
  }

  /**
   * Add doing task.
   */
  // addDoingTask(id: string, title: string, description: string) {
  //   const task: Task = { id, title, description };
  //   this.http
  //     .put<{
  //       // message: string;
  //       data: {
  //         updatedTask: {
  //           id: string;
  //           title: string;
  //           description: string;
  //           status: any;
  //         };
  //       };
  //     }>(`${API_URL}/${id}`, task)
  //     .pipe(
  //       map(taskData => {
  //         return {
  //           id: taskData.data.updatedTask.id,
  //           title: taskData.data.updatedTask.title,
  //           description: taskData.data.updatedTask.description,
  //           status: taskData.data.updatedTask.status
  //         };
  //       })
  //     )
  //     .subscribe(response => {
  //       console.log(response);
  //       task.status = 'doing';
  //       response.status = task.status;

  //       // console.log(response.updatedTask);
  //       // console.log(response.data.updatedTask.status);
  //       // task.id = response.data.updatedTask.id;
  //       // response.data.updatedTask.status = 'doing';
  //       // task.status = response.data.updatedTask.status;
  //       // task.status = 'doing';
  //       // console.log(task.status);
  //       // response.data.updatedTask.title = 'something';
  //       // task.title = response.data.updatedTask.title;

  //       console.log(response);
  //       // this.doingTasks.push(task);
  //       // this.doingUpdate.next([...this.doingTasks]);
  //     });
  // }

  //   /**
  //    * Get a single doing task from server.
  //    */
  //   getDoingTask(id: string) {
  //     return this.http.get<{ _id: string; title: string; description: string }>(
  //       `${API_URL}/doing/${id}`
  //     );
  //   }

  //   /**
  //    * Get all tasks in progress from server.
  //    */
  //   getDoingTasks() {
  //     this.uiService.loadingStateChanged.next(true);
  //     this.http
  //       .get<{ message: string; tasks: any }>(`${API_URL}/doing`)
  //       .pipe(
  //         map(taskData => {
  //           return taskData.tasks.map(task => {
  //             return {
  //               id: task._id,
  //               title: task.title,
  //               description: task.description
  //             };
  //           });
  //         })
  //       )
  //       .subscribe(response => {
  //         this.doingTasks = response;
  //         this.uiService.loadingStateChanged.next(false);
  //         this.doingUpdate.next([...this.doingTasks]);
  //       });
  //   }

  //   /**
  //    * Update doing task.
  //    */
  //   updateDoingTask(id: string, title: string, description: string) {
  //     const task: Task = { id, title, description };
  //     this.http
  //       .put<{ message: string; task: Task }>(`${API_URL}/doing/${id}`, task)
  //       .subscribe(response => {
  //         const updatedTasks = [...this.doingTasks];
  //         const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
  //         updatedTasks[oldTaskIndex] = task;
  //         this.doingTasks = updatedTasks;
  //         this.doingUpdate.next([...this.doingTasks]);
  //       });
  //   }

  //   /**
  //    * Delete doing task.
  //    */
  //   deleteDoingTask(id: string) {
  //     this.http.delete(`${API_URL}/doing/${id}`).subscribe(() => {
  //       this.doingTasks = this.doingTasks.filter(task => task.id !== id);
  //       this.doingUpdate.next([...this.doingTasks]);
  //     });
  //   }

  //   /**
  //    * Add done task.
  //    */
  //   addDoneTask(id: string, title: string, description: string) {
  //     const task: Task = { id, title, description };
  //     this.http
  //       .post<{
  //         message: string;
  //         task: { id: string; title: string; description: string };
  //       }>(`${API_URL}/done`, task)
  //       .subscribe(response => {
  //         task.id = response.task.id;
  //         this.doneTasks.push(task);
  //         this.doneUpdate.next([...this.doneTasks]);
  //       });
  //   }

  //   /**
  //    * Get a single done task from server.
  //    */
  //   getDoneTask(id: string) {
  //     return this.http.get<{ _id: string; title: string; description: string }>(
  //       `${API_URL}/done/${id}`
  //     );
  //   }

  //   /**
  //    * Get all finished tasks from server.
  //    */
  //   getDoneTasks() {
  //     this.uiService.loadingStateChanged.next(true);
  //     this.http
  //       .get<{ message: string; tasks: any }>(`${API_URL}/done`)
  //       .pipe(
  //         map(taskData => {
  //           return taskData.tasks.map(task => {
  //             return {
  //               id: task._id,
  //               title: task.title,
  //               description: task.description
  //             };
  //           });
  //         })
  //       )
  //       .subscribe(data => {
  //         this.doneTasks = data;
  //         this.uiService.loadingStateChanged.next(false);
  //         this.doneUpdate.next([...this.doneTasks]);
  //       });
  //   }

  //   /**
  //    * Update done task.
  //    */
  //   updateDoneTask(id: string, title: string, description: string) {
  //     const task: Task = { id, title, description };
  //     this.http
  //       .put<{ message: string; task: Task }>(`${API_URL}/done/${id}`, task)
  //       .subscribe(response => {
  //         const updatedTasks = [...this.doneTasks];
  //         const oldTaskIndex = updatedTasks.findIndex(t => t.id === task.id);
  //         updatedTasks[oldTaskIndex] = task;
  //         this.doneTasks = updatedTasks;
  //         this.doneUpdate.next([...this.doneTasks]);
  //       });
  //   }

  //   /**
  //    * Delete done task.
  //    */
  //   deleteDoneTask(id: string) {
  //     this.http.delete(`${API_URL}/done/${id}`).subscribe(() => {
  //       this.doneTasks = this.doneTasks.filter(task => task.id !== id);
  //       this.doneUpdate.next([...this.doneTasks]);
  //     });
  //   }
}
