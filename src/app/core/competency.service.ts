import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { Competency, CompetencyGraph, CompetencySearch } from '../../entity/competency';
import { Actor } from '../../entity/actor';
import { Degree } from '../../entity/degree';
import { Condition } from '../../entity/condition';
import { Behavior } from '../../entity/behavior';
import { Employability } from '../../entity/employability';
import { Notes } from '../../entity/notes';
import { Search } from '../../entity/search';
import { SnackbarService } from './snackbar.service';

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
        this.snackBarService.sendNotificationByError(err);
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
      .catch((e)=> {
        this.snackBarService.sendNotificationByError(e);
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
   * Method to send actor updates
   *
   * @param competencyId current competency being edited
   * @param actorUpdate updated fields of an actor attribute
   * @returns null for successful request
   */
  async updateActor(competencyId: string, actorUpdate: Actor) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_ACTOR(competencyId),
        actorUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        this.snackBarService.sendNotificationByError(e);
      });
  }

  /**
   * Method to send behavior updates
   *
   * @param competencyId current competency being edited
   * @param behaviorUpdate udpated fields of a behavior attribute
   * @returns mull for succesful request
   */
  async updateBehavior(competencyId: string, behaviorUpdate: Partial<Behavior>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
        behaviorUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        this.snackBarService.sendNotificationByError(e);
      });
  }

  /**
   * Method to send condition updates
   *
   * @param competencyId current competncy being edited
   * @param conditionUpdate updated fields of a condition attribute
   * @returns null for successful request
   */
  async updateCondition(competencyId: string, conditionUpdate: Partial<Condition>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_CONDITION(competencyId),
        conditionUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        this.snackBarService.sendNotificationByError(e);
      });
  }

  /**
   * Method to send degree updates
   *
   * @param competencyId current competency being edited
   * @param degreeUpdate updated fields of a degree attribute
   * @returns null for successful request
   */
  async updateDegree(competencyId: string, degreeUpdate: Partial<Degree>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_DEGREE(competencyId),
        degreeUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        this.snackBarService.sendNotificationByError(e);
      });
  }

  /**
   * Method to send employability updates
   *
   * @param competencyId current competency being edited
   * @param employabilityUpdate updated fields of a employability attribute
   * @returns null for successful request
   */
  async updateEmployability(competencyId: string, employabilityUpdate: Partial<Employability>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_EMPLOYABILITY(competencyId),
        employabilityUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        this.snackBarService.sendNotificationByError(e);
      });
  }

  async updateNotes(competencyId: string, notesUpdate: Partial<Notes>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_NOTES(competencyId),
        notesUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        console.log(e);
      });
  }
}
