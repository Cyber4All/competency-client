import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Competency } from '../../../../entity/competency';
import { DropdownItem } from '../../../../entity/dropdown';
import { Workrole } from '../../../../entity/workrole';
import { DropdownService } from '../../../core/dropdown.service';
import { WorkroleService } from '../../../core/workrole.service';
import { sleep } from '../../functions/loading';
import { Elements } from '../../../../entity/elements';
import { AuthService } from '../../../core/auth.service';
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
  loading = false;
  actor!: string;
  workrole!: Workrole;
  tasks: Elements[] = [];
  isAdmin = false;
  constructor(
    private workRoleService: WorkroleService,
    private dropdownService: DropdownService,
    private authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.dropdownService.getDropdownItems('actor');
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
   * When the user clicks the "Update Submission" button, it will close this component
   * and open the Competency Builder
   */
  onUpdateSubmission(): void {
    this.close.emit();
    this.updateSubmission.emit();
  }

}
