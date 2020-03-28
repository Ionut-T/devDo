import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectHttpService } from './project-http.service';
import { map } from 'rxjs/operators';
import { IProject } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectStateService {
  private projectChanged = new BehaviorSubject<IProject | null>(null);
  public projectOnChange$ = this.projectChanged.asObservable();
  private projectIdListener = new BehaviorSubject<string>(null);
  public projectIdListener$ = this.projectIdListener.asObservable();

  constructor(private projectHttpService: ProjectHttpService) {}

  /**
   * Get mapped project by id.
   * @param id -> project id.
   * @returns observable.
   */
  public getMappedProject(id: string): Observable<IProject> {
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
  public getMappedProjects(): Observable<IProject[]> {
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
  public getProjectId(id: string) {
    this.projectIdListener.next(id);
  }

  /**
   * Update projects view.
   * @param project -> IProject or null.
   */
  public projectChange(project: IProject | null) {
    this.projectChanged.next(project);
  }
}
