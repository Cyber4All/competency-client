import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Competency } from '../../../../entity/competency';
import { DropdownItem } from '../../../../entity/dropdown';
import { Workrole } from '../../../../entity/nice.workrole';
import { DropdownService } from '../../../core/dropdown.service';
import { NiceWorkroleService } from '../../../core/nice.workrole.service';
import { sleep } from '../../functions/loading';
import { Elements } from '../../../../entity/nice.elements';
import { AuthService } from '../../../core/auth.service';
import { BuilderService } from '../../../core/builder.service';
import { LifecyclesService } from '../../../core/lifecycles.service';
import { Lifecycles } from '../../../../entity/lifecycles';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  @Input() isAdmin = false;
  @Output() updateSubmission = new EventEmitter();
  @Output() statusUpdated = new EventEmitter();
  @Input() competency!: Competency;
  @Input() builderMode = false;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  loading = false;
  actor!: string;
  workrole!: Workrole;
  tasks: Elements[] = [];
  competencyAuthor!: any;
  constructor(
    private workRoleService: NiceWorkroleService,
    private dropdownService: DropdownService,
    private authService: AuthService,
    public builderService: BuilderService,
    private lifecycles: LifecyclesService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.dropdownService.getDropdownItems('actor');
    this.competencyAuthor = await this.authService.getUser(this.competency.authorId);
    // Check actor type; if id retreive dropdown value
    this.dropdownService.actorList.subscribe((actors: DropdownItem[]) => {
      actors.filter((actor) => {
        if (actor._id === this.competency.actor.type) {
          this.actor = actor.value;
        }
      })[0].value;
      if (!this.actor)  {
        this.actor = this.competency.actor.type;
      }
    });
    // load workrole
    if (this.competency.behavior.work_role) {
      this.workrole = await this.workRoleService.getCompleteWorkrole(this.competency.behavior.work_role)
      .then((workroleQuery: any) => {
        return workroleQuery.data.workrole.work_role;
      });
    }
    // load tasks
    if (this.competency.behavior.tasks.length > 0) {
      const tasks = this.competency.behavior.tasks.map(async (task) => await this.workRoleService.getCompleteTask(task)
      .then((taskQuery: any) => {
        return taskQuery.data.task;
      }));
      this.tasks = await Promise.all(tasks);
    }
    await sleep(1000);
    this.authService.isAdmin.subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
    this.loading = false;

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

  async unsubmitCompetency(): Promise<void> {
    const unsubmitSuccess = await this.lifecycles.unsubmitCompetency(this.competency._id);
    if (unsubmitSuccess) {
      this.close.emit();
      this.statusUpdated.emit();
    }
  }
}
