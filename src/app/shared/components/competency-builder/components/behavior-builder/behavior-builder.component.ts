import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { WorkroleService } from '../../../../../core/workrole.service';
import { Behavior } from '../../../../../../entity/behavior';
import { Workrole } from '../../../../../../entity/workrole';
import { Elements } from '../../../../../../entity/elements';
import { BuilderService } from '../../../../../core/builder/builder.service';
import { BuilderValidation } from '../../../../../../entity/builder-validation';
@Component({
  selector: 'cc-behavior-builder',
  templateUrl: './behavior-builder.component.html',
  styleUrls: ['./behavior-builder.component.scss']
})
export class BehaviorBuilderComponent implements OnInit {

  @Input() behavior!: Behavior;
  @Output() behaviorChange = new EventEmitter<{update: string, value: Behavior}>();
  behaviorErrors: BuilderValidation[] = [];

  task = new FormControl('');
  workrole = new FormControl('');
  details = new FormControl('');

  /**
   * 2. Subscribe to tasks and workroles observables
   *  2.1. Set tasks and workroles in builder
   * 3. Accept input for workrole and task
   *  3.1 Search for workrole and update observable
   *  3.2 Search for task and update observable
   *  3.3 Set workrole and task in builder (through observable)
   *  3.4 Virtural Scroller displays new input of tasks and workroles
   * 4. Select task or workrole
   *  4.1 selected id gets added to builder class
   */

  savedTask: string[] = [];
  savedWorkrole = '';
  workroles: Workrole[] = [];
  tasks: Elements[] = [];
  filteredWorkroles: Observable<string[]> = new Observable();
  filteredTasks: Observable<string[]> = new Observable();
  constructor(
    private workroleService: WorkroleService,
    private builderService: BuilderService
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.behavior.work_role) {
      await this.workroleService.getAllWorkroles();
    }
    if (this.behavior.tasks.length === 0) {
      await this.workroleService.getAllTasks();
    }
    // Subscribe to behavior errors
    this.builderService.behaviorErrors.subscribe((errors: BuilderValidation[]) => {
      // Iterate through errors
      errors.map((error: BuilderValidation) => {
        // If error is not already in local behaviorErrors array, add it
        if (this.behaviorErrors.findIndex((behaviorError: BuilderValidation) => {
          return behaviorError.attribute === error.attribute;
        }) === -1) {
          this.behaviorErrors.push(error);
        }
        // Set form validation errors
        this.displayErrors();
      });
    });
    // Subscribe to workrole form control
    this.workrole.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        const selectedWorkrole: Workrole[] = this.workroles.filter((workrole: Workrole) => {
          return workrole.work_role === this.workrole.value;
        });
        this.savedWorkrole = selectedWorkrole[0]._id;
        // Remove workrole error from behaviorErrors array
        this.behaviorErrors = this.behaviorErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'work_role';
        });
        this.workrole.setErrors({error: false});
        // Emit behavior workrole change to parent builder component
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
    // Subscribe to task form control
    this.task.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.tasks.filter((task: Elements) => {
          if(task.description === this.task.value) {
            this.savedTask.push(task._id!);
          }
        });
        // Remove task error from behaviorErrors array
        this.behaviorErrors = this.behaviorErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'tasks';
        });
        this.task.setErrors({error: false});
        // Emit behavior task change to parent builder component
        this.behaviorChange.emit({
          update: 'behavior',
          value: {
            _id: this.behavior._id,
            tasks: this.savedTask,
            details: this.details.value,
            work_role: this.savedWorkrole
          }
        });
      });
    // Subscribe to details form control
    this.details.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((detailsUpdate: string) => {
        // Remove details error from behaviorErrors array
        this.behaviorErrors = this.behaviorErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'details';
        });
        this.details.setErrors({error: false});
        // Emit behavior details change to parent builder component
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
    // If work_role exists, set workrole form value
    if (this.behavior.work_role) {
      this.workroles = [];
      await this.workroleService.getCompleteWorkrole(this.behavior.work_role)
      .then((workroleQuery: any) => {
        this.workroles.push(workroleQuery.data.workrole);
        this.workrole.patchValue(workroleQuery.data.workrole.work_role);
      });
    }
    // If value exists, set type form value
    if(this.behavior.tasks) {
      this.behavior.tasks.map(async (task: string) => {
        this.tasks = [];
        await this.workroleService.getCompleteTask(task)
        .then((taskQuery: any) => {
          this.tasks.push(taskQuery.data.task);
          this.task.setValue([...this.task.value, taskQuery.data.task.description]);
        });
      });
    }
    // If details exists, set details form value
    if (this.behavior.details) {
      this.details.patchValue(this.behavior.details);
    }
    // Subscribe to workroles as they are updated in the service
    this.workroleService.workroles.subscribe((workroles: Workrole[]) => {
      this.workroles = [];
      workroles.map((workrole: Workrole) => {
        this.workroles.push(workrole);
      });
    });
    // Subscribe to tasks as they are updated in the service
    this.workroleService.tasks.subscribe((tasks: Elements[]) => {
      this.tasks = [];
      tasks.map((task: Elements) => {
        this.tasks.push(task);
      });
    });
  }

  displayErrors(): void {
    // Iterate through behavior errors
    this.behaviorErrors.map((error: BuilderValidation) => {
      // If error is for details, set details form control error
      if (error.attribute === 'details') {
        this.details.setErrors({ error: true });
      }
      // If error is for workrole, set workrole form control error
      if (error.attribute === 'work_role') {
        this.workrole.setErrors({ error: true });
      }
      // If error is for tasks, set tasks form control error
      if (error.attribute === 'tasks') {
        this.task.setErrors({ error: true });
      }
    });
  }
}
