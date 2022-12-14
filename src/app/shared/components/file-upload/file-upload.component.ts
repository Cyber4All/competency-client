import { Component, Input, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/file.service';

@Component({
  selector: 'cc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() competencyId = '';
  fileOver = false;
  files: File[] = [];

  constructor(
    private fileService: FileService,
  ) { }

  ngOnInit(): void {
  }

  handleFileOver(event: boolean) {
    this.fileOver = event;
  }

  handleFileDropped(event: FileList) {
    console.log(event[0]);
    this.files.push(event[0]);
  }

  handleFileThroughInput(event: any) {
    this.handleFileDropped(event.target.files);
  }

  async handleFileUpload(file: File, description: string) {
    const sampleDesc = `${file.name} ${description}`;
    await this.fileService.uploadFile(this.competencyId, sampleDesc);
  }

  removeFile(file: File) {
    const index = this.files.indexOf(file);

    this.files.splice(index, 1);
  }
}
