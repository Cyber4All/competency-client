import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { DCWF_Workrole } from '../../entity/dcwf.workrole';
import { GraphQueries } from '../shared/functions/graph-queries';
import { DCWF_Element } from '../../entity/dcwf.elements';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { GraphErrorHandler } from '../shared/functions/GraphErrorHandler';
import { SNACKBAR_COLOR } from '../shared/components/snackbar/snackbar.component';
import { Source } from '../../entity/behavior';

@Injectable({
  providedIn: 'root'
})
export class DcwfWorkroleService {
  private source: Source = Source.DCWF;
  private _workroles: BehaviorSubject<DCWF_Workrole[]> = new BehaviorSubject<DCWF_Workrole[]>([]);
  private _tasks: BehaviorSubject<DCWF_Element[]> = new BehaviorSubject<DCWF_Element[]>([]);
  get workroles(): Observable<DCWF_Workrole[]> {
    return this._workroles.asObservable();
  }
  get tasks(): Observable<DCWF_Element[]> {
    return this._tasks.asObservable();
  }
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private snackBarService: SnackbarService,
  ) {}

  /**
   * Method to retrieve all DCWF workroles
   *
   * @returns array of workrole ids from DCWF DB
   */
  async getAllWorkroles(): Promise<void> {
    this.auth.initHeaders();
    const query = GraphQueries.getAllWorkRoles(this.source);
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        {query},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((workrolesQuery: any) => {
        this._workroles.next(workrolesQuery.data.dcwf_workroles);
      })
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retrieve all task ids from DCWF DB
   *
   * @returns array of task ids
   */
  async getAllTasks(): Promise<void> {
    this.auth.initHeaders();
    const query = GraphQueries.getAllTasks(this.source);
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((tasksQuery: any) => {
        this._tasks.next(tasksQuery.data.dcwf_tasks);
      })
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retrieving attributes of a partial DCWF workrole
   *
   * @param workroleId workrole id
   * @returns complete workrole object
   */
  async getCompleteWorkrole(workroleId: string) {
    this.auth.initHeaders();
    const query = GraphQueries.getCompleteWorkRole(workroleId, this.source);
    return await lastValueFrom(this.http
      .post<DCWF_Workrole>(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((workroleQuery: any) => {
        return workroleQuery.data.dcwf_workrole;
      })
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retrieve a full DCWF element object
   *
   * @param taskId element object id
   * @returns complete element object
   */
  async getCompleteTask(taskId: string) {
    this.auth.initHeaders();
    const query = GraphQueries.getCompleteTask(taskId, this.source);
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((taskQuery: any) => {
        return taskQuery.data.dcwf_task;
      })
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to perform a text search on DCWF workroles
   *
   * @param search text query
   */
  async searchWorkroles(search: string): Promise<void> {
    this.auth.initHeaders();
    const query = GraphQueries.queryWorkroles(search, this.source);
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((workrolesQuery: any) => {
        if (workrolesQuery.data.dcwf_searchWorkroles && workrolesQuery.data.dcwf_searchWorkroles.length > 0) {
          this._workroles.next(workrolesQuery.data.dcwf_searchWorkroles);
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
   * Method to perform a text search on DCWF tasks
   *
   * @param search text query
   */
  async searchTasks(search: string): Promise<void> {
    this.auth.initHeaders();
    const query = GraphQueries.queryTasks(search, this.source);
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((tasksQuery: any) => {
        if (tasksQuery.data.dcwf_searchTasks && tasksQuery.data.dcwf_searchTasks.length > 0) {
          this._tasks.next(tasksQuery.data.dcwf_searchTasks);
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
}
