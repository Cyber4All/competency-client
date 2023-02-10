import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedDirectivesModule,
  ],
  exports: [
    ComponentsModule,
    SharedDirectivesModule,
  ],
})
export class SharedModule { }
