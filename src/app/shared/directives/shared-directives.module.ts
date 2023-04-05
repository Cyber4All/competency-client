import { NgModule } from '@angular/core';
import { BuilderModule } from './builder/builder.module';
import { DragAndDropDirective } from './drag-and-drop.directive';
import { TipDirective } from './tip.directive';



@NgModule({
  declarations: [
    DragAndDropDirective,
    TipDirective,
  ],
  imports: [
    BuilderModule,
  ],
  exports: [
    DragAndDropDirective,
    BuilderModule,
    TipDirective,
  ]
})
export class SharedDirectivesModule { }
