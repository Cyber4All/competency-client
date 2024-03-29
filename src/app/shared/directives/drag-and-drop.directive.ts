import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ccDragAndDrop]'
})
export class DragAndDropDirective {
  @Output() fileOver = new EventEmitter<boolean>();
  @Output() fileDropped = new EventEmitter<any>();

  constructor(private element: ElementRef) {
  }

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver.emit(true);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver.emit(false);
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver.emit(false);
    this.fileDropped.emit(event.dataTransfer.files);
  }
}
