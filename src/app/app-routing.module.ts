import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DowntimeComponent } from './shared/pages/downtime/downtime.component';
import { BetaWelcomeComponent } from './shared/pages/beta-welcome/beta-welcome.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { BetaGuard } from './shared/guards/beta.guard';
import { TermsOfServiceComponent } from './shared/pages/terms-of-service/terms-of-service.component';
import { HelpPageComponent } from './shared/pages/help-page/help-page.component';
import { VerifyEmailGuard } from './shared/guards/verify-email.guard';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { PasswordResetGuard } from './shared/guards/password-reset.guard';
import { TaskToolComponent } from './task-tool/task-tool/task-tool.component';

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
    path: 'verify-email',
    canActivate: [VerifyEmailGuard],
  },
  {
    path: 'password-reset',
    canActivate: [PasswordResetGuard]
  },
  {
    path: 'auth/reset/password',
    component: ResetPasswordComponent
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'help',
    component: HelpPageComponent
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
    path: 'system/termsofservice',
    component: TermsOfServiceComponent
  },
  {
    path: 'task-tool',
    component: TaskToolComponent
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
