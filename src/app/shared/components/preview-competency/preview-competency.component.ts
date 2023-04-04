import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompetencyBuilder } from 'src/app/core/builder/competency-builder.class';
import { Lifecycles } from 'src/entity/lifecycles';
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
    this.competency.status = Lifecycles.SUBMITTED;
    this.competency.behavior = {
      tasks: ['T0137: Maintain database management systems software.'],
      work_role: 'Database Administrator',
      details: 'yeetus'
    };

  }

  competencyStatusIcon(): string {
    switch(this.competency.status) {
      case Lifecycles.DRAFT:
        return 'far fa-file-edit fa-2x';
      case Lifecycles.SUBMITTED:
        return 'far fa-file-exclamation fa-2x';
      case Lifecycles.PUBLISHED:
        return 'far fa-file-checked fa-2x';
      case Lifecycles.DEPRECATED:
        return 'far fa-file-minus fa-2x';
      case Lifecycles.REJECTED:
        return 'far fa-file-times fa-2x';
    }
  }

  adminButtonText(): string {
    switch (this.competency.status) {
      case Lifecycles.SUBMITTED:
        return 'PUBLISH';
      case Lifecycles.PUBLISHED:
        return 'DEPRECATE';
      case Lifecycles.DEPRECATED:
        return 'EDIT';
      default:
        return 'yeet';
    }
  }

  onAdminButtonClicked(): void {
    switch (this.competency.status) {
      case Lifecycles.SUBMITTED:
        this.onPublish();
        break;
      case Lifecycles.PUBLISHED:
        this.onDeprecate();
        break;
      case Lifecycles.DEPRECATED:
        this.onUpdateSubmission();
        break;
      default:
        break;
    }
  }

  /**
   * When the user clicks the "Update Submission" button, it will close this component
   * and open the Competency Builder
   */
  onUpdateSubmission(): void {
    this.close.emit();
    this.updateSubmission.emit();
  }

  onPublish(): void {
    // TODO: Define this one
    this.competency.status = Lifecycles.PUBLISHED;
  }

  onDeprecate(): void {
    // TODO: fill this one
    this.competency.status = Lifecycles.DEPRECATED;
  }

  onReject(): void {
    // TODO: yada yada
    this.competency.status = Lifecycles.REJECTED;
  }
}
