import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { WorkroleService } from '../../../../../core/workrole.service';
import { Behavior } from '../../../../../../entity/behavior';
import { Workrole } from '../../../../../../entity/workrole';
import { Elements } from '../../../../../../entity/elements';
@Component({
  selector: 'cc-behavior-builder',
  templateUrl: './behavior-builder.component.html',
  styleUrls: ['./behavior-builder.component.scss']
})
export class BehaviorBuilderComponent implements OnInit {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() behavior!: Behavior;
  @Output() behaviorChange = new EventEmitter<{update: string, value: Behavior}>();
  @Output() behaviorUpdated = new EventEmitter<boolean>(false);
  currIndex: number | null = null;
  task = new FormControl('');
  savedTask = '';
  details = new FormControl('', [Validators.required]);
  workrole = new FormControl('');
  savedWorkrole = '';
  workroles: Workrole[] = [];
  tasks: Elements[] = [];
  filteredWorkroles: Observable<string[]> = new Observable();
  filteredTasks: Observable<string[]> = new Observable();
  constructor(
    private workroleService: WorkroleService
  ) {}

  async ngOnInit(): Promise<void> {
    this.task.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        const selectedTask: Elements[] = this.tasks.filter((task: Elements) => {
          return task.description === this.task.value;
        });
        this.savedTask = selectedTask[0]._id!;
        this.behaviorChange.emit({
          update: 'behavior',
          value: {
            _id: this.behavior._id,
            tasks: selectedTask[0]._id!,
            details: this.details.value,
            work_role: this.savedWorkrole
          }
        });
      });
    this.workrole.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        const selectedWorkrole: Workrole[] = this.workroles.filter((workrole: Workrole) => {
          return workrole.work_role === this.workrole.value;
        });
        this.savedWorkrole = selectedWorkrole[0]._id;
        this.behaviorChange.emit({
          update: 'behavior',
          value: {
            _id: this.behavior._id,
            tasks: this.savedTask,
            details: this.details.value,
            work_role: selectedWorkrole[0]._id!
          }
        });
      });
    this.details.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((detailsUpdate: string) => {
        this.behaviorChange.emit({
          update: 'behavior',
          value: {
            _id: this.behavior._id,
            tasks: this.savedTask,
            details: detailsUpdate,
            work_role: this.savedWorkrole
          }
        });
      });
    // If value exists, set type form control
    if(this.behavior.tasks) {
      await this.workroleService.getCompelteTask(this.behavior.tasks)
      .then((taskQuery: any) => {
        this.task.setValue(this.task.value, taskQuery.data.task.description);
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
}