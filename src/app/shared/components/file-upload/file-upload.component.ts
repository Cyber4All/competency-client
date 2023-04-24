import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../../core/file.service';
import { MimeTypes } from '../../../../entity/mimeTypes';

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
   * Validates that the file follows the proper extensions, and
   * adds the file to the list
   *
   * @param event A list of files received from the user
   */
  handleFileDropped(event: FileList) {
    let extension: string;
    Array.from(event).forEach(file => {
      extension = file.name.split('.')[1];
      if((Object.values(MimeTypes) as string[]).includes(extension)) {
        this.files.push(file);
      } else {
        console.log(extension, 'does not work'); // TODO: Replace with toaster message
      }
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
