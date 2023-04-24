import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { PagesModule } from './pages/pages.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SharedDirectivesModule,
    PagesModule,
    PipesModule
  ],
  exports: [
    ComponentsModule,
    SharedDirectivesModule,
    PagesModule,
    PipesModule
  ],
})
export class SharedModule { }
