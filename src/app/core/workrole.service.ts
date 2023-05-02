import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import {
  getCompleteWorkRole,
  Workrole,
  getAllWorkRoles,
  getAllTasks,
  getCompleteTask,
  queryWorkroles,
  queryTasks
} from '../../entity/workrole';
import { getPreReqs } from '../../entity/actor';
import { GraphErrorHandler } from '../shared/functions/GraphErrorHandler';
import { SnackbarService } from './snackbar.service';
import { Elements } from '../../entity/elements';
import { SNACKBAR_COLOR } from '../shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class WorkroleService {
  private _workroles: BehaviorSubject<Workrole[]> = new BehaviorSubject<Workrole[]>([]);
  private _tasks: BehaviorSubject<Elements[]> = new BehaviorSubject<Elements[]>([]);
  get workroles(): Observable<Workrole[]> {
    return this._workroles.asObservable();
  }
  get tasks(): Observable<Elements[]> {
    return this._tasks.asObservable();
  }
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
  async getAllWorkroles(): Promise<void> {
    this.auth.initHeaders();
    const query = getAllWorkRoles();
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        {query},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((workrolesQuery: any) => {
        this._workroles.next(workrolesQuery.data.workroles);
      })
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
  async getAllTasks(): Promise<void> {
    this.auth.initHeaders();
    const query = getAllTasks();
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((tasksQuery: any) => {
        this._tasks.next(tasksQuery.data.tasks);
      })
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
   * Method to retreive a full element object
   *
   * @param taskId element object id
   * @returns complete element object
   */
  async getCompleteTask(taskId: string) {
    this.auth.initHeaders();
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
   * Method to perform a text search on workroles
   *
   * @param search text query
   */
  async searchWorkroles(search: string): Promise<void> {
    this.auth.initHeaders();
    const query = queryWorkroles(search);
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((workrolesQuery: any) => {
        if (workrolesQuery.data.searchWorkroles && workrolesQuery.data.searchWorkroles.length > 0) {
          this._workroles.next(workrolesQuery.data.searchWorkroles);
        } else {
          this._workroles.next([]);
          this.snackBarService.notification$.next({
            message: `${search} is not a valid workrole`,
            title: 'Workrole Not Found',
            color: SNACKBAR_COLOR.DANGER
          });
        }
      })
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to perform a text search on tasks
   *
   * @param search text query
   */
  async searchTasks(search: string): Promise<void> {
    this.auth.initHeaders();
    const query = queryTasks(search);
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((tasksQuery: any) => {
        if (tasksQuery.data.searchTasks && tasksQuery.data.searchTasks.length > 0) {
          this._tasks.next(tasksQuery.data.searchTasks);
        } else {
          this._tasks.next([]);
          this.snackBarService.notification$.next({
            message: `${search} is not a valid task`,
            title: 'Task Not Found',
            color: SNACKBAR_COLOR.DANGER
          });
        }
      })
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
    this.auth.initHeaders();
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
