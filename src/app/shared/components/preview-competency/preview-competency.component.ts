import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompetencyBuilder } from 'src/app/core/builder/competency-builder.class';
import { User } from 'src/entity/user';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  @Input() isAdmin = true;
  @Output() updateSubmission = new EventEmitter();

  @Input() competency!: CompetencyBuilder;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.competency.behavior = {
      tasks: ['T0137: Maintain database management systems software.'],
      work_role: 'Database Administrator',
      details: 'yeetus'
    };
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
