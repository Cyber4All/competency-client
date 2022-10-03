import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { COMPETENCY_ROUTES } from '../../environments/routes';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {

  constructor(private http: HttpClient) { }

  getAllCompetencies(query?: { role?: string[], audience?: string[], task?: string[] }) {
    return this.http
      .get(
        COMPETENCY_ROUTES.GET_ALL_COMPETENCIES(query),
      )
      .toPromise();
  }

  createCompetency(competency: any) {
    return this.http
      .post(
        COMPETENCY_ROUTES.CREATE_COMPETENCY(competency.author),
        competency,
        { withCredentials: true, responseType: 'text' }
      )
      .toPromise();
  }

  editCompetency(competency: any) {
    return this.http
      .patch(
        COMPETENCY_ROUTES.EDIT_COMPETENCY(competency),
        competency,
        { withCredentials: true, responseType: 'text' }
      )
      .toPromise();
  }

  lockCompetency(competency: any, lock: boolean) {
    return this.http
      .patch(
        COMPETENCY_ROUTES.LOCK_COMPETENCY(competency._id),
        { locked: lock },
        { withCredentials: true, responseType: 'text' }
      )
      .toPromise();
  }
}

