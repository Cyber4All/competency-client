import { NgModule } from '@angular/core';
import { PanelModule } from './panel/panel.module';
import { DragAndDropDirective } from './drag-and-drop.directive';
import { TipDirective } from './tip.directive';



@NgModule({
  declarations: [
    DragAndDropDirective,
    TipDirective,
  ],
  imports: [
    PanelModule,
  ],
  exports: [
    DragAndDropDirective,
    TipDirective,
    PanelModule,
  ]
})
export class SharedDirectivesModule { }
