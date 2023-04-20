import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './help-page/help-page.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { DowntimeComponent } from './downtime/downtime.component';
import { BetaWelcomeComponent } from './beta-welcome/beta-welcome.component';

@NgModule({
  declarations: [
    HelpPageComponent,
    TermsOfServiceComponent,
    DowntimeComponent,
    BetaWelcomeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HelpPageComponent,
    TermsOfServiceComponent,
    DowntimeComponent,
    BetaWelcomeComponent
  ]
})
export class PagesModule { }
