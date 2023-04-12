import { NgModule } from '@angular/core';
import { PanelModule } from './panel/panel.module';
import { DragAndDropDirective } from './drag-and-drop.directive';



@NgModule({
  declarations: [
    DragAndDropDirective,
  ],
  imports: [
    PanelModule,
  ],
  exports: [
    DragAndDropDirective,
    PanelModule,
  ]
})
export class SharedDirectivesModule { }
