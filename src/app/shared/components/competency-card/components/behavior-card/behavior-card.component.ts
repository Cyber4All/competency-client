import { Component, Input, OnInit, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { CompetencyService } from '../../../../../core/competency.service';
import { WorkroleService } from '../../../../../core/workrole.service';
import { Behavior } from '../../../../../../entity/Behavior';
import { Workrole } from '../../../../../../entity/workrole';
import { Elements } from '../../../../../../entity/elements';
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
    // Set list of all workrole tasks
    await this.workroleService.getAllTasks()
    .then((tasksQuery: any) => {
      this.tasks = tasksQuery.data.tasks;
    });
    // Set list of all workroles
    await this.workroleService.getAllWorkroles()
    .then((workrolesQuery: any) => {
      this.workroles = workrolesQuery.data.workroles;
    });
    // Pipe filtered tasks input to match dropdown list
    this.filteredTasks = this.task.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTasks(value || '')),
    );
    // Pipe filtred workroles input to match dropdown list
    this.filteredWorkroles = this.workrole.valueChanges.pipe(
      startWith(''),
      map(value => this._filterWorkroles(value || '')),
    );
  }

  /**
   * Method to filter tasks based on search input
   *
   * @param value keyword input for tasks
   * @returns filtered list of tasks
   */
  private _filterTasks(value: string): string[] {
    const filterValue = value.toLowerCase();

    const tasks = this.tasks.map((obj: Elements) => {
      return obj.description;
    });

    return tasks.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * Method to filter workroles based on search input
   *
   * @param value keyword input for workroles
   * @returns list of filtered workroles
   */
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
        behaviorUpdate.task = selectedTask[0]._id ?? '';
      }
      if(selectedWorkrole.length > 0) {
        behaviorUpdate.work_role = selectedWorkrole[0]._id ?? '';
      }
      const res: any = await this.competencyService.updateBehavior(
        this.competencyId,
        behaviorUpdate
      );
    }
  }
}
