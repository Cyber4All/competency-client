import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, Subject } from 'rxjs';
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
  // Builder - Behavior validation errors
  behaviorErrors: BuilderValidation[] = [];
  // Virtual Scroller and dropdowns
  scrollerHeight = '100px';
  showWorkrolesDropdown = false;
  showTasksDropdown = false;
  loading = false;
  // Form controls
  task = new FormControl('');
  workrole = new FormControl('');
  details = new FormControl('');
  // Search input for workrole and task
  workroleInput$: Subject<string> = new Subject<string>();
  taskInput$: Subject<string> = new Subject<string>();
  // Workrole and task arrays
  workroles: Workrole[] = [];
  tasks: Elements[] = [];
  // Selected workrole and task from virtual scroller
  selectedWorkrole!: Workrole;
  selectedTask!: Elements[];
  // Filtered workroles and tasks
  filteredWorkroles: Observable<string[]> = new Observable();
  filteredTasks: Observable<string[]> = new Observable();
  constructor(
    private workroleService: WorkroleService,
    private builderService: BuilderService
  ) {}

  async ngOnInit(): Promise<void> {
    /**
     * 1. Get all workroles and tasks from service if they are not set in behavior
     */
    if (!this.behavior.work_role) {
      await this.workroleService.getAllWorkroles();
    }
    if (this.behavior.tasks.length === 0) {
      await this.workroleService.getAllTasks();
    }

    /**
     * 2. Subscribe to Behavior Builder Errors
     */
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

    /**
     * 3. Subscribe to workroles and tasks as they are updated in the builder-service
     */
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

    /**
     * 4. Subscribe to form controls
     */
    // Subscribe to workrole form control
    this.workrole.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
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
            tasks: this.behavior.tasks,
            details: this.behavior.details,
            work_role: this.selectedWorkrole._id!
          }
        });
      });
    // Subscribe to task form control
    this.task.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        // Get task ids from Elements array
        const taskIds: string[] = [];
        this.tasks.filter((task: Elements) => {
          if(task.description === this.task.value) {
            taskIds.push(task._id!);
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
            tasks: taskIds,
            details: this.behavior.details,
            work_role: this.behavior.work_role,
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
            tasks: this.behavior.tasks,
            details: detailsUpdate,
            work_role: this.behavior.work_role,
          }
        });
      });

    /**
     * 5. Set form values if they exist
     */
    // If work_role exists, set workrole form value
    if (this.behavior.work_role) {
      this.workroles = [];
      // The work_role ObjectId is stored on a competnecy
      await this.workroleService.getCompleteWorkrole(this.behavior.work_role)
      .then((workroleQuery: any) => {
        this.workroles.push(workroleQuery.data.workrole);
        this.selectedWorkrole = workroleQuery.data.workrole;
        this.workrole.patchValue(workroleQuery.data.workrole._id);
      });
    }
    // If tasks exists, set type form value
    if(this.behavior.tasks) {
      this.tasks = [];
      this.selectedTask = [];
      // The tasks ObjectIds are stored on a competency
      this.behavior.tasks.map(async (task: string) => {
        await this.workroleService.getCompelteTask(task)
        .then((taskQuery: any) => {
          this.tasks.push(taskQuery.data.task);
          this.selectedTask.push(taskQuery.data.task);
          this.task.setValue([...this.task.value, taskQuery.data.task.description]);
        });
      });
    }
    // If details exists, set details form value
    if (this.behavior.details) {
      this.details.patchValue(this.behavior.details);
    }

    /**
     * 6. Subscribe to search inputs
     */
    // Subscribe to workrole search input
    this.workroleInput$.pipe(debounceTime(650))
      .subscribe( async (value: string) => {
        await this.workroleService.searchWorkroles(value.trim());
        this.loading = false;
      });
    this.workroleInput$.subscribe((value: string) => {
      if (value && value !== '') {
        this.showWorkrolesDropdown = true;
        this.loading = true;
      } else {
        this.showWorkrolesDropdown = false;
      }
    });
    // Subscribe to task search input
    this.taskInput$.pipe(debounceTime(650))
      .subscribe( async (value: string) => {
        await this.workroleService.searchTasks(value.trim());
        this.loading = false;
      });
      this.taskInput$.subscribe((value: string) => {
        if (value && value !== '') {
          this.showTasksDropdown = true;
          this.loading = true;
        } else {
          this.showTasksDropdown = false;
        }
      });
  }

  /**
   * Registers typing events from the workrole input
   *
   * @param event The typing event
   */
  workroleKeyup(event: any) {
    this.workroleInput$.next(event.target.value);
  }

  /**
   * Registers typing events from the task input
   *
   * @param event The typing event
   */
  taskKeyup(event: any) {
    this.taskInput$.next(event.target.value);
  }

  /**
   * Closes either dropdown menu
   */
  closeDropdown() {
    if (this.showWorkrolesDropdown) {
      this.showWorkrolesDropdown = false;
    }
    if (this.showTasksDropdown) {
      this.showTasksDropdown = false;
    }
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
