import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { CoreModule } from './core/core.module';
import { BoardComponent } from './board/board.component';
import { TodoComponent } from './board/todo/todo.component';
import { DoingComponent } from './board/doing/doing.component';
import { DoneComponent } from './board/done/done.component';
import { CreateTaskComponent } from './board/todo/create-task/create-task.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TodoComponent,
    DoingComponent,
    DoneComponent,
    CreateTaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CreateTaskComponent]
})
export class AppModule {}
