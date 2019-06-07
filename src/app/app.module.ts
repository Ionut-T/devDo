import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { CoreModule } from './core/core.module';
import { BoardComponent } from './board/board.component';
import { TodoComponent } from './board/todo/todo.component';
import { DoingComponent } from './board/doing/doing.component';
import { DoneComponent } from './board/done/done.component';
import { CreateTaskComponent } from './board/todo/create-task/create-task.component';
import { EditTaskComponent } from './board/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TodoComponent,
    DoingComponent,
    DoneComponent,
    CreateTaskComponent,
    EditTaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
