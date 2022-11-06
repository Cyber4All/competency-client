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
      ))
      .catch((e)=> {
        console.log(e);
      });
  }

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

  async deleteCompetency(competencyId: string) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .delete(
        COMPETENCY_ROUTES.DELETE_COMPETENCY(competencyId),
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then(res => {
        console.log(res);
      },
      err => {
        console.log(err);
      });
  }

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

  async updateBehavior(competencyId: string, behaviorUpdate: Partial<Behavior>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
        behaviorUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then(res => {
        console.log(res);
      },
      err => {
        console.log(err);
      });
  }

  async updateCondition(competencyId: string, conditionUpdate: Partial<Condition>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_CONDITION(competencyId),
        conditionUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then(res => {
        console.log(res);
      },
      err => {
        console.log(err);
      });
  }

  async updateDegree(competencyId: string, degreeUpdate: Partial<Degree>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
        degreeUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then(res => {
        console.log(res);
      },
      err => {
        console.log(err);
      });
  }

  async updateEmployability(competencyId: string, employabilityUpdate: Partial<Employability>) {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.UPDATE_EMPLOYABILITY(competencyId),
        employabilityUpdate,
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ))
      .then(res => {
        console.log(res);
      },
      err => {
        console.log(err);
      });
  }
}
