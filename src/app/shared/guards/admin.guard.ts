import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AuthenticatedGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router,){
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree{
        return this.router.navigate(['/dashboard']);
    }
    }
