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
    Array.from(event).forEach(file => {
      this.files.push(file);
    });
  }

  handleFileThroughInput(event: any) {
    this.handleFileDropped(event.target.files);
  }

  async handleFileUpload(file: File, description: string) {
    await this.fileService.uploadFile(this.competencyId, file, description);
  }

  /**
   * Removes a file that was about to be submitted
   *
   * @param file The file to be removed
   */
  removeFile(file: File) {
    const index = this.files.indexOf(file);

    this.files.splice(index, 1);
  }
}
