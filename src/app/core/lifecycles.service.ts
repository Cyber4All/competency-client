import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { LIFECYCLE_ROUTES } from 'src/environments/routes';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class LifecyclesService {

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private snackbar: SnackbarService
  ) { }

  async submitCompetency(competencyId: string): Promise<boolean> {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.SUBMIT_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      )).then(() => {
        return true;
      }).catch((err) => {
        this.snackbar.sendNotificationByError(err);
        return false;
      });
  }

  async publishCompetency(competencyId: string): Promise<boolean> {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.PUBLISH_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      )).then(() => {
        return true;
      }).catch((err) => {
        this.snackbar.sendNotificationByError(err);
        return false;
      });
  }

  async rejectCompetency(competencyId: string): Promise<boolean> {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.REJECT_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      )).then(() => {
        return true;
      }).catch((err) => {
        this.snackbar.sendNotificationByError(err);
        return false;
      });
  }

  async deprecateCompetency(competencyId: string): Promise<boolean> {
    this.auth.initHeaders();
    return await lastValueFrom(this.http
      .patch(
        LIFECYCLE_ROUTES.DEPRECATE_COMPETENCY(competencyId),
        { userId: this.auth.user?._id },
        { headers: this.auth.headers, withCredentials: true }
      )).then(() => {
        return true;
      }).catch((err) => {
        this.snackbar.sendNotificationByError(err);
        return false;
      });
  }
}
