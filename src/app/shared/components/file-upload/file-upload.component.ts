import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() competencyId = '';
  fileOver = false;
  files: File[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  handleFileOver(event: boolean) {
    this.fileOver = event;
  }

  handleFileDropped(event: FileList) {
    console.log(event[0]);
    this.files.push(event[0]);
  }
}
