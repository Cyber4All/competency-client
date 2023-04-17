import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DowntimeComponent } from './shared/components/downtime/downtime.component';
import { BetaWelcomeComponent } from './shared/components/beta-welcome/beta-welcome.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { BetaGuard } from './shared/guards/beta.guard';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthenticatedGuard, AdminGuard, BetaGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthenticatedGuard, BetaGuard],
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'auth/reset/password',
    component: ResetPasswordComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'downtime',
    component: DowntimeComponent
  },
  {
    path: 'welcome',
    component: BetaWelcomeComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
