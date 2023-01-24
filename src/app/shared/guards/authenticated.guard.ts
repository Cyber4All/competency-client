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
    await this.auth.checkStatus();
    if (!this.auth.user) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
