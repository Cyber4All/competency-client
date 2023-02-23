import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthenticatedGuard } from './shared/guards/authenticated.guard';

const routes: Routes = [
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthenticatedGuard, AdminGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthenticatedGuard],
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
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'downtime'
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
