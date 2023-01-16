import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        let adminUser = false;
        // Validate user actions for admin access
        await this.auth.validateAdminAccess();
        this.auth.isAdmin.subscribe((isAdmin: boolean) => {
            if(isAdmin) {
                adminUser = true;
            } else {
                adminUser = false;
            }
        });
        // If not admin; redirect to author dashboard
        if (!adminUser) {
            this.router.navigate(['/dashboard']);
        }
        return adminUser;
    }
}
