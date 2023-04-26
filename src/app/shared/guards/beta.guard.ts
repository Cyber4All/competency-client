import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BetaGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        let betaUser = false;
        // Validate user actions for beta access
        await this.auth.validateBetaAccess();
        this.auth.isBetaUser.subscribe((isBeta: boolean) => {
            betaUser = isBeta;
        });
        // If not beta user: redirect to welcome page
        if (!betaUser) {
            this.router.navigate(['/welcome']);
        }
        return betaUser;
    }
}
