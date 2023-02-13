import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { BannerComponent } from './banner/banner.component';
@NgModule({
  declarations: [
    BannerComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedDirectivesModule,
  ],
  exports: [
    ComponentsModule,
    SharedDirectivesModule,
    BannerComponent
  ],
})
export class SharedModule { }
