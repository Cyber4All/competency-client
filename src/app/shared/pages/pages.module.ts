import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './help-page/help-page.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { DowntimeComponent } from './downtime/downtime.component';
import { BetaWelcomeComponent } from './beta-welcome/beta-welcome.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    HelpPageComponent,
    TermsOfServiceComponent,
    DowntimeComponent,
    BetaWelcomeComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule
  ],
  exports: [
    HelpPageComponent,
    TermsOfServiceComponent,
    DowntimeComponent,
    BetaWelcomeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PagesModule { }
