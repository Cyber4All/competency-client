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

  /**
   * Function that receives the fileOver EventEmitter from the ccDragAndDrop directive
   * and changes the content of the drag-and-drop area when a dragged file is hovering over
   * the area
   *
   * @param event Whether or not a dragged file is hovering over the drag-and-drop area
   */
  handleFileOver(event: boolean) {
    this.fileOver = event;
  }

  /**
   * Records all entered files when they are dropped or entered into the
   * drag-and-drop area
   *
   * @param event A list of files received from the user
   */
  handleFileDropped(event: FileList) {
    Array.from(event).forEach(file => {
      this.files.push(file);
    });
  }

  /**
   * Handles entering a file if the file was entered in manually instead
   * of using the drag-and-drop feature
   *
   * @param event The list of files received from the user, entered by input
   */
  handleFileThroughInput(event: any) {
    this.handleFileDropped(event.target.files);
  }

  /**
   * Begins the process of submitting a file to S3 and the API
   *
   * @param file The file to submit
   * @param description The description of the documentation to be entered in
   */
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
