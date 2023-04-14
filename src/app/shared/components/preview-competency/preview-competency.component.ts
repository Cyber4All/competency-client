import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Competency } from '../../../../entity/competency';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  @Output() updateSubmission = new EventEmitter();

  @Input() competency!: Competency;
  @Input() builderMode = false;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * When the user clicks the "Update Submission" button, it will close this component
   * and open the Competency Builder
   */
  onUpdateSubmission(): void {
    this.close.emit();
    this.updateSubmission.emit();
  }

}