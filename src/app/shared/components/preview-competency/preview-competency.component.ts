import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LifecyclesService } from 'src/app/core/lifecycles.service';
import { Lifecycles } from 'src/entity/lifecycles';
import { User } from 'src/entity/user';
import { CompetencyBuilder } from 'src/entity/builder.class';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  @Input() isAdmin = false;
  @Output() updateSubmission = new EventEmitter();

  @Input() competency!: CompetencyBuilder;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  @Output() statusUpdated = new EventEmitter();
  competencyAuthor!: any;

  constructor(
    private lifecycles: LifecyclesService,
    private auth: AuthService
    ) { }

  async ngOnInit(): Promise<void> {
    this.isAdmin = true;
    this.competency.behavior = {
      tasks: ['lol'],
      details: 'something',
      work_role: 'work_role'
    };
    this.competency.condition = {
      tech: ['some tech'],
      scenario: 'some scenario',
      limitations: 'limitations',
      documentation: []
    };
    this.competencyAuthor = await this.auth.getUser(this.competency.authorId);
  }

  /**
   * Returns an icon to display depending on competency status
   * Only for admin view
   *
   * @returns A FontAwesome icon
   */
  competencyStatusIcon(): string {
    switch(this.competency.status) {
      case Lifecycles.DRAFT:
        return 'far fa-file-edit fa-2x';
      case Lifecycles.SUBMITTED:
        return 'far fa-file-exclamation fa-2x';
      case Lifecycles.PUBLISHED:
        return 'far fa-file-check fa-2x';
      case Lifecycles.DEPRECATED:
        return 'far fa-file-minus fa-2x';
      case Lifecycles.REJECTED:
        return 'far fa-file-times fa-2x';
    }
  }

  /**
   * Returns text to be displayed on the blue main button
   * Only for admin view
   *
   * @returns The button text to be displayed
   */
  adminButtonText(): string {
    switch (this.competency.status) {
      case Lifecycles.SUBMITTED:
        return 'APPROVE';
      case Lifecycles.PUBLISHED:
        return 'DEPRECATE';
      case Lifecycles.DEPRECATED:
        return 'EDIT';
      default:
        return 'yeet';
    }
  }

  /**
   * Provides the behavior when the blue main button is clicked
   * Only for admin view
   *
   */
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

  /**
   * Publishes a competency
   */
  async onPublish(): Promise<void> {
    const publishSuccess = await this.lifecycles.publishCompetency(this.competency._id);
    if (publishSuccess) {
      this.close.emit();
      this.statusUpdated.emit();
    }
  }

  /**
   * Deprecates a competency
   */
  async onDeprecate(): Promise<void> {
    const deprecateSuccess = await this.lifecycles.deprecateCompetency(this.competency._id);
    if(deprecateSuccess) {
      this.close.emit();
      this.statusUpdated.emit();
    }
  }

  /**
   * Rejects a competency
   */
  async onReject(): Promise<void> {
    const rejectSuccess = await this.lifecycles.rejectCompetency(this.competency._id);
    if (rejectSuccess) {
      this.close.emit();
      this.statusUpdated.emit();
    }
  }
}
