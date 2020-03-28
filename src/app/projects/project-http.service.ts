import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IProject } from './project.model';
import { Observable } from 'rxjs';

type ProjectResponseType = HttpResponse<{ project: IProject }>;
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
  public createProject(project: IProject): Observable<ProjectResponseType> {
    return this.http.post<{ project: IProject }>(this.URL, project, { observe: 'response' });
  }

  /**
   * Get all projects.
   */
  public getProjects(): Observable<ProjectArrayResponseType> {
    return this.http.get<{ projects: IProject[] }>(this.URL, { observe: 'response' });
  }

  /**
   * Get project by id.
   * @param id -> project id.
   * @returns observable.
   */
  public getProject(id: string): Observable<ProjectResponseType> {
    return this.http.get<{ project: IProject }>(`${this.URL}/${id}`, { observe: 'response' });
  }

  /**
   * Update project.
   * @param id -> project id.
   * @param project -> Partial project.
   * @returns observable.
   */
  public updateProject(id: string, project: Partial<IProject>): Observable<ProjectResponseType> {
    return this.http.put<{ project: IProject }>(`${this.URL}/${id}`, project, { observe: 'response' });
  }

  /**
   * Delete project.
   * @param id -> project id.
   * @returns observable.
   */
  public deleteProject(id: string): Observable<HttpResponse<null>> {
    return this.http.delete<null>(`${this.URL}/${id}`, { observe: 'response' });
  }
}
