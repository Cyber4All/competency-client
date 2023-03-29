import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { Competency, CompetencyGraph, CompetencySearch } from '../../entity/competency';
import { CompetencyCardSearch, Search } from '../../entity/search';
import { SnackbarService } from './snackbar.service';
import { GraphErrorHandler } from '../shared/functions/GraphErrorHandler';

/**
 * Function to toggle loading state display
 *
 * @param ms - time to toggle loading state
 * @returns resolves promise within specified time
 */
export function sleep(ms: number): Promise<any> {
  return new Promise((res) => setTimeout(res, ms));
}

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private snackBarService: SnackbarService
  ) {}

  /**
   * Method to retrieve all competencies based on query params
   *
   * @optional q is a query object for searching competencies and setting pagination
   * @returns Promise with list of competencies
   */
  getAllCompetencies(
      q?: {
        text?: string,
        page?: number,
        limit?: number,
        author?: string,
        status?: string[],
        version?: number
      }
    ): Promise<Search> {
    this.auth.initHeaders();
    // Format to uppercase for GraphQL
    if (q && q.status) {
      q.status = q.status.map((val) => val.toUpperCase());
    }
    const query = CompetencySearch(q);
    return lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query, userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((res: any) => {
        return res.data.search;
      })
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to retreive all fields of a competency
   *
   * @param competencyId competency to retreive
   * @returns full competency
   */
  async getCompetencyById(competencyId: string): Promise<Competency> {
    this.auth.initHeaders();
    const query = CompetencyGraph(competencyId);
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((res: any) => {
        return res.data.competency;
      })
      .catch((err)=> {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Method to delete a specific competency
   *
   * @param competencyId id of competency to be deleted
   * @returns null
   */
  async deleteCompetency(competencyId: string) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .delete(
        COMPETENCY_ROUTES.DELETE_COMPETENCY(competencyId),
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        this.snackBarService.sendNotificationByError(e);
      });
  }

  /**
   * Method to retrieve some fields of a competency for the competency card
   *
   * @param competencyId is the id of competency to retrieve
   * @returns Promise with competency status, actor.type, behavior.[tasks, work_role, details]
   */
  async getCompetencyCard(competencyId: string): Promise<Competency> {
  this.auth.initHeaders();
  const query = CompetencyCardSearch(competencyId);
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then((res: any) => {
        return res.data.competency;
      })
      .catch((err)=> {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackBarService.sendNotificationByError(err);
        }
      });
    }
}
