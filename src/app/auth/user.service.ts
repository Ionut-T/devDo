import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUser } from './user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly URL = environment.apiUrl + '/user';

  constructor(private http: HttpClient) {}

  update(id: string, user: Partial<IUser>): Observable<HttpResponse<Partial<IUser>>> {
    return this.http.put(`${this.URL}/${id}`, user, { observe: 'response' });
  }
}
