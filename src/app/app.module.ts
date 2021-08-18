import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/auth/login/login.component';
import { CompetenciesDashboardComponent } from './pages/competencies-dashboard/competencies-dashboard.component';
import { CompetencyBuilderComponent } from './pages/competencies-dashboard/competency-builder/competency-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CompetenciesDashboardComponent,
    CompetencyBuilderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
