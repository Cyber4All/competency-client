import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() competencyId = '';

  constructor() { }

  ngOnInit(): void {
  }

}
