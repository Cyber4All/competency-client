import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import {
  getCompleteWorkRole,
  Workrole,
  getAllWorkRoles,
  getAllTasks,
  getCompleteTask
} from '../../entity/workrole';
import { getPreReqs } from '../../entity/actor';
import { GraphErrorHandler } from '../shared/functions/GraphErrorHandler';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class WorkroleService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private snackBarService: SnackbarService,
  ) {}

  /**
   * Method to retreive all workroles
   *
   * @returns array of workrole ids from NICE DB
   */
  async getAllWorkroles() {
    this.auth.initHeaders();
    const query = getAllWorkRoles();
    return await lastValueFrom(this.http
      .post<[Workrole]>(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        {query},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retrieving attributes of a partial workrole
   *
   * @param workroleId workrole id
   * @returns complete workrole object
   */
  async getCompleteWorkrole(workroleId: string) {
    this.auth.initHeaders();
    const query = getCompleteWorkRole(workroleId);
    return await lastValueFrom(this.http
      .post<Workrole>(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retrive all task ids from NICE DB
   *
   * @returns array of task ids
   */
  async getAllTasks() {
    this.auth.initHeaders();
    const query = getAllTasks();
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retreive a full element object
   *
   * @param taskId element object id
   * @returns complete element object
   */
  async getCompelteTask(taskId: string) {
    const query = getCompleteTask(taskId);
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retreive a list of NICE knowledge statements and NICE skills
   *
   * @returns list of NICE knowledge and skills
   */
  async getActorPrereqs() {
    const query = getPreReqs();
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        {query},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }
}
