import { NgModule } from '@angular/core';
import { BuilderModule } from './builder/builder.module';
import { DragAndDropDirective } from './drag-and-drop.directive';



@NgModule({
  declarations: [
    DragAndDropDirective,
  ],
  imports: [
    BuilderModule,
  ],
  exports: [
    DragAndDropDirective,
    BuilderModule,
  ]
})
export class SharedDirectivesModule { }
