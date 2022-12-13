import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ccDragAndDrop]'
})
export class DragAndDropDirective {
  @HostBinding('class.file-over') fileOver = false;
  @Output() fileDropped = new EventEmitter<any>();

  constructor(private element: ElementRef) {
  }

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.style.backgroundColor = 'red';
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log('ahhh');
    this.element.nativeElement.style.backgroundColor = '';
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
