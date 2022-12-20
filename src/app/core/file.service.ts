import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { COMPETENCY_ROUTES } from 'src/environments/routes';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  async uploadFile(competencyId: string, description: string) {
    this.authService.initHeaders();
    await lastValueFrom(
      this.http.post(
        COMPETENCY_ROUTES.CREATE_DOCUMENTATION(competencyId),
        {
          userId: this.authService.user?._id,
          description: description,
          uri: '', // to be implemented once Lambda route works in prod
        },
        { headers: this.authService.headers, withCredentials: true, responseType: 'json' }
      )
    ).then((res) => {
      // returns the id of the documentation object
    });
  }
}
