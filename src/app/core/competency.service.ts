import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { BehaviorSubject, firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Competency, CompetencyGraph, CompetencySearch } from 'src/entity/competency';
import { Audience } from 'src/entity/audience';
import { Degree } from 'src/entity/degree';
import { Condition } from 'src/entity/condition';
import { Behavior } from 'src/entity/behavior';
import { Employability } from 'src/entity/employability';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {

  // Observable boolean to toggle download spinner in components
  private _builder$ = new BehaviorSubject<number | null>(null);

  // Public get for loading observable
  get build() {
    return this._builder$;
  }

  set build(build: BehaviorSubject<number | null>) {
    this._builder$ = build;
  }

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

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
      ));
  }

  async getCompetencyById(competencyId: string): Promise<Competency> {
    this.auth.initHeaders();
    const query = CompetencyGraph(competencyId);
    const val = await lastValueFrom(this.http
      .post<Competency>(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
    return val;
  }

  async createCompetency() {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.CREATE_COMPETENCY(),
        {},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async deleteCompetency(competencyId: string) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .delete(
        COMPETENCY_ROUTES.DELETE_COMPETENCY(competencyId),
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async updateAudience(competencyId: string, audienceUpdate: Audience) {
    this.auth.initHeaders();
    try {
      return await lastValueFrom(this.http
        .patch(
          COMPETENCY_ROUTES.UPDATE_AUDIENCE(competencyId),
          {type: audienceUpdate.type, details: audienceUpdate.details},
          { headers: this.auth.headers, withCredentials: true, responseType: 'text' }
        ));
    } catch (e) {
      // Should throw a toaster
      return e;
    }
  }

  async updateBehavior(competencyId: string, behaviorUpdate: Behavior) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
        behaviorUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async updateCondition(competencyId: string, conditionUpdate: Condition) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_CONDITION(competencyId),
        conditionUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async updateDegree(competencyId: string, degreeUpdate: Degree) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
        degreeUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async updateEmployability(competencyId: string, employabilityUpdate: Employability) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_EMPLOYABILITY(competencyId),
        employabilityUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }
}
