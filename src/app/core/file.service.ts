import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    const res = await this.http.post(
      COMPETENCY_ROUTES.CREATE_DOCUMENTATION(competencyId),
      {
        userId: this.authService.user?._id,
        description: description,
        uri: '', // to be implemented once Lambda route works in prod
      }
      );
    return res;
  }
}
