import { Component, Input, OnInit } from '@angular/core';
import { Competency } from '../../../../entity/competency';
import { Lifecycles } from '../../../../entity/lifecycles';
import { Workrole } from '../../../../entity/nice.workrole';
import { sleep } from '../../functions/loading';
import { FrameworkService } from '../../../core/framework.service';
import { DCWF_Element } from '../../../../entity/dcwf.elements';

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
    private frameworkService: FrameworkService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    // Set frameworkService source
    if (this.competency.behavior.source) {
      this.frameworkService.currentFramework = this.competency.behavior.source;
    }
    // load workrole
    if (this.competency.behavior.work_role) {
      this.workrole = await this.frameworkService.getCompleteWorkrole(this.competency.behavior.work_role);
    }
    // load tasks
    if (this.competency.behavior.tasks.length > 0) {
      const tasks = this.competency.behavior.tasks.map(async (task) => await this.frameworkService.getCompleteTask(task)
        .then((task: any) => {
          return task.description;
        }));
      await Promise.all(tasks)
        .then((tasks: string[]) => {
          this.tasks = tasks;
        });
    }
    await sleep(1000);
    this.loading = false;
  }
}
