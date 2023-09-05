import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { DropdownItem, DropdownType } from '../../entity/dropdown';
import { GraphQueries } from '../shared/functions/graph-queries';
import { GraphErrorHandler } from '../shared/functions/GraphErrorHandler';
@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private _actorList: BehaviorSubject<DropdownItem[]> = new BehaviorSubject<DropdownItem[]>([]);
  private _timeList: BehaviorSubject<DropdownItem[]> = new BehaviorSubject<DropdownItem[]>([]);
  get actorList(): Observable<DropdownItem[]> {
    return this._actorList.asObservable();
  }
  get timeList(): Observable<DropdownItem[]> {
    return this._timeList.asObservable();
  }
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private snackBarService: SnackbarService
  ) { }
  /**
   * Method to retrieve dropdown options based on type query
   *
   * @returns list of actors
   */
  async getDropdownItems(type: string): Promise<void> {
    this.auth.initHeaders();
    const queryType = type.toUpperCase();  // Format to uppercase for GraphQL
    const query = GraphQueries.dropdownObjects(queryType);
    await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((res: any) => {
        if (type === DropdownType.ACTOR) {
          this._actorList.next(res.data.dropdownItems);
        } else if (type === DropdownType.TIME) {
          this._timeList.next(res.data.dropdownItems);
        }
      })
      .catch((err)=> {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }
}
