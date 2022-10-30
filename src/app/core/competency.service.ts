import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { Competency, CompetencyGraph } from 'src/entity/competency';
import { Audience } from 'src/entity/audience';
import { Degree } from 'src/entity/degree';
import { Condition } from 'src/entity/condition';
import { Behavior } from 'src/entity/behavior';
import { Employability } from 'src/entity/employability';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getAllCompetencies(q?: { role?: string[], audience?: string[], task?: string[] }) {
    this.auth.initHeaders();
    const query = `query 
    Query{competency(competencyId: "63488ddcb835f7100cf6ea94"){
      audience{type}, behavior{details}, condition{tech}, degree{complete}, employability{details}}}`;
    return lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.RETRIEVE_COMPETENCY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  async getCompetencyById(competencyId: string): Promise<Competency> {
    this.auth.initHeaders();
    const query = CompetencyGraph(competencyId);
    const val = await lastValueFrom(this.http
      .post<Competency>(
        COMPETENCY_ROUTES.RETRIEVE_COMPETENCY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
    console.log(val);
    return val;
  }

  createCompetency() {
    this.auth.initHeaders();
    return lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.CREATE_COMPETENCY(),
        {},
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  editCompetency(competency: any) {
    this.auth.initHeaders();
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.CREATE_COMPETENCY(),
        competency,
        { headers: this.auth.headers, withCredentials: true, responseType: 'text' }
      ));
  }

  updateAudience(competencyId: string, audienceUpdate: Audience) {
    this.auth.initHeaders();
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_AUDIENCE(competencyId),
        audienceUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  updateBehavior(competencyId: string, behaviorUpdate: Behavior) {
    this.auth.initHeaders();
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
        behaviorUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  updateCondition(competencyId: string, conditionUpdate: Condition) {
    this.auth.initHeaders();
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_CONDITION(competencyId),
        conditionUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  updateDegree(competencyId: string, degreeUpdate: Degree) {
    this.auth.initHeaders();
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
        degreeUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  updateEmployability(competencyId: string, employabilityUpdate: Employability) {
    this.auth.initHeaders();
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_EMPLOYABILITY(competencyId),
        employabilityUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
  }

  lockCompetency(competency: any, lock: boolean) {
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.CREATE_COMPETENCY(),
        { locked: lock },
        { headers: this.auth.headers, withCredentials: true, responseType: 'text' }
      ));
  }
}

