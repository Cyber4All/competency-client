import { Component, Input, OnInit, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { CompetencyService } from 'src/app/core/competency.service';
import { WorkroleService } from 'src/app/core/workrole.service';
import { Behavior } from 'src/entity/behavior';
import { Workrole } from 'src/entity/workrole';
import { Elements } from 'src/entity/elements';
@Component({
  selector: 'cc-behavior-card',
  templateUrl: './behavior-card.component.html',
  styleUrls: ['./behavior-card.component.scss']
})
export class BehaviorCardComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() behavior!: Behavior;
  @Output() behaviorChange = new EventEmitter<{update: string, value: Behavior}>();
  currIndex: number | null = null;
  task = new FormControl('');
  details = new FormControl('', [Validators.required]);
  workrole = new FormControl('');
  workroles: Workrole[] = [];
  tasks: Elements[] = [];
  filteredWorkroles: Observable<string[]> = new Observable();
  filteredTasks: Observable<string[]> = new Observable();
  constructor(
    private competencyService: CompetencyService,
    private workroleService: WorkroleService
  ) {}

  async ngOnInit(): Promise<void> {
    // If value exists, set type form control
    if(this.behavior.tasks) {
      await this.workroleService.getCompelteTask(this.behavior.tasks)
        .then((taskQuery: any) => {
          this.task.patchValue(taskQuery.data.task.description);
        });
    }
    // If value exists, set details form control
    if (this.behavior.details) {
      this.details.patchValue(this.behavior.details);
    }
    // If value exists, set workrole form control
    if (this.behavior.work_role) {
      await this.workroleService.getCompleteWorkrole(this.behavior.work_role)
      .then((workroleQuery: any) => {
        this.workrole.patchValue(workroleQuery.data.workrole.work_role);
      });
    }

    await this.workroleService.getAllTasks()
    .then((tasksQuery: any) => {
      this.tasks = tasksQuery.data.tasks;
    });

    await this.workroleService.getAllWorkroles()
    .then((workrolesQuery: any) => {
      this.workroles = workrolesQuery.data.workroles;
    });

    this.filteredTasks = this.task.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTasks(value || '')),
    );

    this.filteredWorkroles = this.workrole.valueChanges.pipe(
      startWith(''),
      map(value => this._filterWorkroles(value || '')),
    );
  }

  private _filterTasks(value: string): string[] {
    const filterValue = value.toLowerCase();

    const tasks = this.tasks.map((obj: Elements) => {
      return obj.description;
    });

    return tasks.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterWorkroles(value: string): string[] {
    const filterValue = value.toLowerCase();

    const work_roles = this.workroles.map((obj: Workrole) => {
      return obj.work_role;
    });

    return work_roles.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnChanges() {
    // If any value updates, update parent component
    if(this.task.value || this.details.value || this.workrole.value) {
      this.behaviorChange.emit({
        update: 'behavior',
        value: {
          _id: this.behavior._id,
          tasks: this.task.value,
          details: this.details.value,
          work_role: this.workrole.value
        }
      });
    };
  }

  /**
   * Method to advance to next step
   */
  async updateBehavior() {
    const behaviorUpdate = {
      _id: this.behavior._id,
      task: '',
      details: this.details.value,
      work_role: ''
    };
    if(this.task.valid && this.details.valid && this.workrole.valid) {
      const selectedTask: Elements[] = this.tasks.filter((task: Elements) => {
        return task.description === this.task.value;
      });
      const selectedWorkrole: Workrole[] = this.workroles.filter((workrole: Workrole) => {
        return workrole.work_role === this.workrole.value;
      });
      if(selectedTask.length > 0) {
        console.log('task updated', selectedTask);
        behaviorUpdate.task = selectedTask[0]._id ?? '';
      }
      if(selectedWorkrole.length > 0) {
        console.log('workrole updated', selectedWorkrole);
        behaviorUpdate.work_role = selectedWorkrole[0]._id ?? '';
      }
      const res: any = await this.competencyService.updateBehavior(
        this.competencyId,
        behaviorUpdate
      );
    }
  }
}
