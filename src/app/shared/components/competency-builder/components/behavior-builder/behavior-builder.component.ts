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
  savedTask: string[] = [];
  details = new FormControl('');
  workrole = new FormControl('');
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
    // If value exists, set type form control
    if(this.behavior.tasks) {
      this.behavior.tasks.map(async (task: string) => {
        await this.workroleService.getCompelteTask(task)
        .then((taskQuery: any) => {
          this.task.setValue([...this.task.value, taskQuery.data.task.description]);
        });
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

/*
//   async ngOnInit(): Promise<void> {
//     // If value exists, set type form control
//     // if(this.behavior.tasks) {
//     //   await this.workroleService.getCompelteTask(this.behavior.tasks)
//     //   .then((taskQuery: any) => {
//     //     this.task.setValue(this.task.value, taskQuery.data.task.description);
//     //   });
//     // }
//     // If value exists, set details form control
//     // if (this.behavior.details) {
//     //   this.details.patchValue(this.behavior.details);
//     // }
//     // // If value exists, set workrole form control
//     // if (this.behavior.work_role) {
//     //   await this.workroleService.getCompleteWorkrole(this.behavior.work_role)
//     //   .then((workroleQuery: any) => {
//     //     this.workrole.patchValue(workroleQuery.data.workrole.work_role);
//     //   });
//     // }
//     // // Set list of all workrole tasks
//     // await this.workroleService.getAllTasks()
//     // .then((tasksQuery: any) => {
//     //   this.tasks = tasksQuery.data.tasks;
//     // });
//     // // Set list of all workroles
//     // await this.workroleService.getAllWorkroles()
//     // .then((workrolesQuery: any) => {
//     //   this.workroles = workrolesQuery.data.workroles;
//     // });
//     // // Pipe filtered tasks input to match dropdown list
//     // this.filteredTasks = this.task.valueChanges.pipe(
//     //   startWith(''),
//     //   map(value => this._filterTasks(value || '')),
//     // );
//     // // Pipe filtred workroles input to match dropdown list
//     // this.filteredWorkroles = this.workrole.valueChanges.pipe(
//     //   startWith(''),
//     //   map(value => this._filterWorkroles(value || '')),
//     // );
//   }

//   /**
//    * Method to filter tasks based on search input
//    *
//    * @param value keyword input for tasks
//    * @returns filtered list of tasks
//    */
//   // private _filterTasks(value: string): string[] {
//   //   const filterValue = value.toLowerCase();

//   //   const tasks = this.tasks.map((obj: Elements) => {
//   //     return obj.description;
//   //   });

//   //   return tasks.filter(option => option.toLowerCase().includes(filterValue));
//   // }

//   /**
//    * Method to filter workroles based on search input
//    *
//    * @param value keyword input for workroles
//    * @returns list of filtered workroles
//    */
//   // private _filterWorkroles(value: string): string[] {
//   //   const filterValue = value.toLowerCase();

//   //   const work_roles = this.workroles.map((obj: Workrole) => {
//   //     return obj.work_role;
//   //   });

//   //   return work_roles.filter(option => option.toLowerCase().includes(filterValue));
//   // }
// } */
