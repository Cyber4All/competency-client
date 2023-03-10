import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderDirective } from './builder.directive';
import { BuilderViewerComponent } from './builder-viewer/builder-viewer.component';



@NgModule({
  imports: [CommonModule],
  declarations: [BuilderDirective, BuilderViewerComponent],
  exports: [BuilderDirective],
  entryComponents: [BuilderViewerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class BuilderModule { }
