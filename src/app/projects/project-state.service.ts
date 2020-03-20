import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectHttpService } from './project-http.service';
import { map } from 'rxjs/operators';
import { IProject } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectStateService {
  private projectListener = new BehaviorSubject<string>(null);
  projectListener$ = this.projectListener.asObservable();

  constructor(private projectHttpService: ProjectHttpService) {}

  /**
   * Get mapped project by id.
   * @param id -> project id.
   * @returns observable.
   */
  getMappedProject(id: string): Observable<IProject> {
    return this.projectHttpService.getProject(id).pipe(
      map((res: any) => {
        return {
          id: res.body._id,
          name: res.body.name,
          description: res.body.description
        };
      })
    );
  }

  /**
   * Get project id.
   * @param id -> project id.
   */
  getProjectId(id: string) {
    this.projectListener.next(id);
  }
}
