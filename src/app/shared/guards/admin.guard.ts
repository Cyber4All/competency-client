import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class AdminGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router,){
    }
     canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        let val = false;
        this.auth.isAdmin.subscribe((isAdmin: boolean)=>{
            if(isAdmin){
                val = true;
            }else{
                this.router.navigate(['/dashboard']);
                val = false;
            }
        });
        return val;
    }
    }
