import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IProject } from './project.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

type ProjectResponseType = HttpResponse<IProject>;
type ProjectArrayResponseType = HttpResponse<{ projects: IProject[] }>;

@Injectable({
  providedIn: 'root'
})
export class ProjectHttpService {
  private readonly URL = environment.apiUrl + '/projects';

  constructor(private http: HttpClient) {}

  /**
   * Create project.
   */
  createProject(project: Partial<IProject>): Observable<ProjectResponseType> {
    return this.http.post<IProject>(this.URL, project, { observe: 'response' });
  }

  /**
   * Get all projects.
   */
  getProjects(): Observable<ProjectArrayResponseType> {
    return this.http.get<{ projects: IProject[] }>(this.URL, { observe: 'response' });
  }

  /**
   * Get project by id.
   * @param id -> project id.
   * @returns observable.
   */
  getProject(id: string): Observable<ProjectResponseType> {
    return this.http.get<IProject>(`${this.URL}/${id}`, { observe: 'response' });
  }

  /**
   * Delete project.
   * @param id -> project id.
   * @returns observable.
   */
  deleteProject(id: string): Observable<HttpResponse<null>> {
    return this.http.delete<null>(`${this.URL}/${id}`, { observe: 'response' });
  }
}
