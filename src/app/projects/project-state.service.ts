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
      map((res: any) => ({
        id: res.body.project._id,
        name: res.body.project.name,
        description: res.body.project.description
      }))
    );
  }

  /**
   * Get mapped project by id.
   * @param id -> project id.
   * @returns observable.
   */
  getMappedProjects(): Observable<IProject[]> {
    return this.projectHttpService.getProjects().pipe(
      map(res =>
        res.body.projects.map((project: any) => ({
          id: project._id,
          name: project.name,
          description: project.description,
          url: project.url
        }))
      )
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
