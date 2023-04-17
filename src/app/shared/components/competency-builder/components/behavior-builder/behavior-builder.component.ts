import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, Subject } from 'rxjs';
import { WorkroleService } from '../../../../../core/workrole.service';
import { Behavior } from '../../../../../../entity/behavior';
import { Workrole } from '../../../../../../entity/workrole';
import { Elements } from '../../../../../../entity/elements';
import { BuilderService } from '../../../../../core/builder.service';
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
  scrollerHeight = '200px';
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
  selectedTask: Elements[] = [];
  taskDropdownPlaceholder = '';
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
      .pipe(debounceTime(650))
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
      .pipe(debounceTime(650))
      .subscribe(() => {
        // Get task ids from Elements array
        const taskIds: string[] = this.selectedTask.map((task: Elements) => {
          return task._id!;
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
      .pipe(debounceTime(650))
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
    // If work_role or tasks exist, set workrole and task form value
    if (this.behavior.work_role || this.behavior.tasks.length > 0) {
      if (this.behavior.work_role) {
        // Check if workrole is ObjectId or workrole name
        this.workroles.filter((workrole: Workrole) => {
          if (this.behavior.work_role === workrole.work_role) {
            // Workrole name is stored on a competency; retrieve workrole ObjectId
            this.workroles = [workrole];
            this.selectedWorkrole = workrole;
          } else if (this.behavior.work_role === workrole._id){
            // Workole ObjectId is stored on a competency; set workrole object
            this.workroles = [workrole];
            this.selectedWorkrole = workrole;
          }
        });
        if (this.selectedWorkrole) {
          this.behavior.work_role = this.selectedWorkrole._id!;
        }
      }
      if(this.behavior.tasks.length > 0) {
        // Check if task is ObjectId or task name
        this.behavior.tasks.map((task: string) => {
          this.tasks.filter((taskElement: Elements) => {
            if (task === taskElement.description) {
              // Task name is stored on a competency; retrieve task ObjectId
              this.tasks.push(taskElement);
              this.selectedTask.push(taskElement);
            } else if (task === taskElement._id){
              // Task ObjectId is stored on a competency; set task object
              this.tasks.push(taskElement);
              this.selectedTask.push(taskElement);
            }
          });
        });
        if (this.selectedTask.length > 0) {
          this.behavior.tasks = this.selectedTask.map((task: Elements) => {
            return task._id!;
          });
        }
      }
      this.workrole.patchValue(true);
      this.task.patchValue(true);
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
        if (value && value !== '') {
          await this.workroleService.searchWorkroles(value.trim());
        } else {
          this.selectedWorkrole = {} as Workrole;
          // Text input is empty; check if a selected task(s) exist
          if (this.selectedTask.length > 0) {
            // Selected task(s) exist; set workroles that contain selected task(s)
            // Clear workroles array
            this.workroles = [];
            // Check each selected task
            this.selectedTask.map((task: Elements) => {
              // Check workrole array on task
              task.work_roles?.map((workrole: Workrole) => {
                // If the workrole does not already exist in this.workroles then add it
                if (this.workroles.findIndex(( w: Workrole) => w._id === workrole._id) === -1) {
                  this.workroles.push(workrole);
                }
              });
            });
          } else {
            // No selected tasks; reset workroles and tasks arrays
            await this.workroleService.getAllWorkroles();
            await this.workroleService.getAllTasks();
          }
        }
        this.loading = false;
      });
    // Subscribe to task search input
    this.taskInput$.pipe(debounceTime(650))
      .subscribe( async (value: string) => {
        if (value && value !== '') {
          await this.workroleService.searchTasks(value.trim());
        } else {
          // Text input is empty; check if a selected workrole exists
          if (this.selectedWorkrole._id) {
            // Selected workrole exists; set tasks that contain selected workrole
            // Clear tasks array
            this.tasks = [];
            // Check each selected task
            this.selectedWorkrole.tasks?.map((task: Elements) => {
              // If the task does not already exist in this.tasks then add it
              if (this.tasks.findIndex(( t: Elements) => t._id === task._id) === -1) {
                this.tasks.push(task);
              }
            });
          } else {
            // No selected workrole; reset tasks and workroles arrays
            await this.workroleService.getAllTasks();
            await this.workroleService.getAllWorkroles();
          }
        }
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
      this.taskDropdownPlaceholder = '';
    }
  }

  async removeSelectedTask(task: Elements) {
    this.selectedTask.splice(this.selectedTask.indexOf(task), 1);
    this.task.patchValue(true);
    if (this.selectedTask.length === 0) {
      await this.workroleService.getAllTasks();
      if (!this.selectedWorkrole._id) {
        await this.workroleService.getAllWorkroles();
      }
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
