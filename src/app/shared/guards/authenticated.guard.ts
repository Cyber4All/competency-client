import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  async canActivate(): Promise<boolean> {
    if(await this.auth.checkStatus()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
