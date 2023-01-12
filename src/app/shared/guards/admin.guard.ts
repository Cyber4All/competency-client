import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class AdminGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router,){
    }
    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        // Implement validate admin here
        this.router.navigate(['/dashboard']);
        return false;
    }
    }
