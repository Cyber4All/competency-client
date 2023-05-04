import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../../core/file.service';
import { MimeTypes } from '../../../../entity/mimeTypes';
import { FormControl } from '@angular/forms';
import { Documentation } from '../../../../entity/Documentation';
import { SnackbarService } from '../../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../snackbar/snackbar.component';

@Component({
  selector: 'cc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() competencyId = '';
  @Input() documentation!: FormControl;
  fileOver = false;
  files: { name: string, documentationId?: string }[] = [];

  constructor(
    private fileService: FileService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    // Check if any documentation exists on the competency form control
    if (this.documentation.value) {
      // For each documentation, add the file to the files array
      this.documentation.value.forEach((doc: Documentation) => {
        const file: { name: string, documentationId?: string } = {
          name: doc.description,
          documentationId: doc._id
        };
        // Ensure that the file is not already in the files array
        if (this.files.findIndex((file: { name: string, documentationId?: string }) => {
          return file.documentationId === doc._id;
        }) === -1) {
          this.files.push(file);
        }
      });
    }
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
    Array.from(event).forEach(async file => {
      try {
        const updatedFile: { name: string, documentationId?: string } = {
          name: file.name,
          // Id is returned from service
          documentationId: ''
        };
        const doc: Documentation = await this.fileService.uploadFile(this.competencyId, file, file.name);
        // Update the builder form with the documentation
        this.documentation.patchValue(doc);
        updatedFile.documentationId = doc._id;

        this.files.push(updatedFile);
      } catch (e) {
        this.snackbarService.sendNotificationByError(e);
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
   * Removes a file that was about to be submitted
   *
   * @param file The file to be removed
   */
  async removeFile(file: { name: string, documentationId?: string }) {
    // Set the documentation to be removed
    const doc = this.documentation.value.find((doc: Documentation) => {
      return doc._id === file.documentationId;
    });
    this.documentation.patchValue({remove: true, id: file.documentationId});
    const index = this.files.indexOf(file);
    this.files.splice(index, 1);
    await this.fileService.deleteFile(this.competencyId, doc);
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
}
