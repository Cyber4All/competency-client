import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { getCompleteWorkRole, Workrole, getAllWorkRoles, getAllTasks } from 'src/entity/workrole';

@Injectable({
  providedIn: 'root'
})
export class WorkroleService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  async getAllWorkroles() {
    this.auth.initHeaders();
    const query = getAllWorkRoles();
    return await lastValueFrom(this.http
      .post<[Workrole]>(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        {query},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async getCompleteWorkrole(workroleId: string) {
    this.auth.initHeaders();
    const query = getCompleteWorkRole(workroleId);
    return await lastValueFrom(this.http
      .post<Workrole>(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async getAllTasks() {
    this.auth.initHeaders();
    const query = getAllTasks();
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }
}
