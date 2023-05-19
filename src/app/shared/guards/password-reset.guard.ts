import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SnackbarService } from '../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetGuard implements CanActivate {

  constructor(
    private snackbar: SnackbarService,
    private router: Router
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Promise<boolean> {
    const params = route.queryParams;
    await this.router.navigate(['/']);
    if (params.status && params.status !== 'success') {
        // An error occurred
        this.snackbar.notification$.next({
        title: 'Password Reset Failed',
        message: params.message,
        color: SNACKBAR_COLOR.DANGER,
        });
    } else if (params.status && params.status === 'success') {
        // Password reset
        this.snackbar.notification$.next({
        title: 'Success!',
        message: 'Your password has been reset!',
        color: SNACKBAR_COLOR.SUCCESS,
        });
    }
    return true;
  }

}
