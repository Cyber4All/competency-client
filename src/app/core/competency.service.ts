import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { Competency, CompetencyGraph } from 'src/entity/competency';

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

  getCompetencyById(competencyId: string): Promise<Competency> {
    this.auth.initHeaders();
    const query = CompetencyGraph(competencyId);
    return lastValueFrom(this.http
      .post<Competency>(
        COMPETENCY_ROUTES.RETRIEVE_COMPETENCY(),
        { query },
        { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
      ));
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

  lockCompetency(competency: any, lock: boolean) {
    return lastValueFrom(this.http
      .patch(
        COMPETENCY_ROUTES.CREATE_COMPETENCY(),
        { locked: lock },
        { headers: this.auth.headers, withCredentials: true, responseType: 'text' }
      ));
  }
}

