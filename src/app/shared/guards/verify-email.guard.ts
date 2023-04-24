import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { SnackbarService } from 'src/app/core/snackbar.service';
import { SNACKBAR_COLOR } from '../components/snackbar/snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class VerifyEmailGuard implements CanActivate {

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
            title: 'Could not verify email',
            message: params.message,
            color: SNACKBAR_COLOR.DANGER,
            });
        } else if (params.status && params.status === 'success') {
            // Email verified
            this.snackbar.notification$.next({
            title: 'Email verified',
            message: 'Your email has been verified!',
            color: SNACKBAR_COLOR.SUCCESS,
            });
        }
        return true;
    }
}
