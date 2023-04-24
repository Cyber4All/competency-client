import { Component, Input, OnInit } from '@angular/core';
import { Competency } from '../../../../entity/competency';
import { Lifecycles } from '../../../../entity/lifecycles';
import { Workrole } from '../../../../entity/workrole';
import { WorkroleService } from '../../../core/workrole.service';
import { sleep } from '../../functions/loading';

@Component({
  selector: 'cc-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent implements OnInit {
  @Input() competency!: Competency;
  lifecycle = Lifecycles;
  loading = false;
  workrole!: Workrole;
  tasks: string[] = [];
  constructor(
    private workRoleService: WorkroleService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
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
        return taskQuery.data.task.description;
      }));
      this.tasks = await Promise.all(tasks);
    }
    await sleep(1000);
    this.loading = false;
  }
}
