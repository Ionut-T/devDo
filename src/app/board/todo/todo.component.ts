import { Component, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { MatDialog } from '@angular/material';
import { CreateTaskComponent } from './create-task/create-task.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  task: Task;
  tasks: Task[];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog(title: string, content: string) {
    const task: Task = { title, content };
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '300px',
      data: { title: task.title, content: task.content }
    });
  }
}
