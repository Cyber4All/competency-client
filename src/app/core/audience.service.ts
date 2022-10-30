import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs';
import { Audience } from '../../entity/audience';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AudienceService {

  constructor(
    private authService: AuthService
  ) { }
}
