import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetencyInputComponent } from './competency-input/competency-input.component';
import { CompetencyCardComponent } from './competency-card/competency-card.component';
import { AudienceCardComponent } from './competency-card/components/audience-card/audience-card.component';
import { BehaviorCardComponent } from './competency-card/components/behavior-card/behavior-card.component';
import { ContextCardComponent } from './competency-card/components/context-card/context-card.component';
import { DegreeCardComponent } from './competency-card/components/degree-card/degree-card.component';
import { EmployabilityCardComponent } from './competency-card/components/employability-card/employability-card.component';



@NgModule({
  declarations: [
    CompetencyInputComponent,
    CompetencyCardComponent,
    AudienceCardComponent,
    BehaviorCardComponent,
    ContextCardComponent,
    DegreeCardComponent,
    EmployabilityCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
