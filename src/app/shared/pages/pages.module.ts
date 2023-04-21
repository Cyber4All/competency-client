import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './help-page/help-page.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { DowntimeComponent } from './downtime/downtime.component';
import { BetaWelcomeComponent } from './beta-welcome/beta-welcome.component';
import { ComponentsModule } from '../components/components.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    HelpPageComponent,
    TermsOfServiceComponent,
    DowntimeComponent,
    BetaWelcomeComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MatTabsModule,
    MatExpansionModule,
    MatListModule
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
