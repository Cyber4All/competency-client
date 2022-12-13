import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { CompetencyGraph, CompetencySearch } from '../../entity/Competency';
import { Audience } from '../../entity/Audience';
import { Degree } from '../../entity/Degree';
import { Condition } from '../../entity/Condition';
import { Behavior } from '../../entity/Behavior';
import { Employability } from '../../entity/Employability';
@Injectable({
  providedIn: 'root'
})
export class CompetencyService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
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
    ) {
    this.auth.initHeaders();
    const query = CompetencySearch(q);
    return lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query, userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        console.log(e);
      });
  }

  /**
   * Method to retreive all fields of a competency
   *
   * @param competencyId competency to retreive
   * @returns full competency
   */
  async getCompetencyById(competencyId: string) {
    this.auth.initHeaders();
    const query = CompetencyGraph(competencyId);
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        console.log(e);
      });
  }

  /**
   * Method to create the shell of a competency
   *
   * @returns new competency id
   */
  async createCompetency() {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.CREATE_COMPETENCY(),
        {},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        console.log(e);
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
        console.log(e);
      });
  }

  /**
   * Method to send audinece updates
   *
   * @param competencyId current competency being edited
   * @param audienceUpdate updated fields of an audience attribute
   * @returns null for successful request
   */
  async updateAudience(competencyId: string, audienceUpdate: Audience) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_AUDIENCE(competencyId),
        audienceUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .catch((e)=> {
        console.log(e);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
      });
  }
}
