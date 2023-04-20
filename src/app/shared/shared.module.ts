import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { PagesModule } from './pages/pages.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SharedDirectivesModule,
    PagesModule,
  ],
  exports: [
    ComponentsModule,
    SharedDirectivesModule,
    PagesModule,
  ],
})
export class SharedModule { }
