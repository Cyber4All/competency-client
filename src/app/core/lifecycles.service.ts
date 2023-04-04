import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { LIFECYCLE_ROUTES } from 'src/environments/routes';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LifecyclesService {

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) { }

  async submitCompetency(competencyId: string) {
    this.auth.initHeaders();
    await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.SUBMIT_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      ));
  }

  async publishCompetency(competencyId: string) {
    this.auth.initHeaders();
    await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.PUBLISH_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      ));
  }

  async rejectCompetency(competencyId: string) {
    await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.REJECT_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      ));
  }

  async deprecateCompetency(competencyId: string) {
    await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.DEPRECATE_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      ));
  }
}
