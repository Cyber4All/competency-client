import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelDirective } from './panel.directive';
import { PanelViewerComponent } from './panel-viewer/panel-viewer.component';



@NgModule({
  imports: [CommonModule],
  declarations: [PanelDirective, PanelViewerComponent],
  exports: [PanelDirective],
  entryComponents: [PanelViewerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PanelModule { }
