import { Component, DoCheck, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CompetencyService } from '../../core/competency.service';
import { behavior } from 'src/assets/behavior';
import { audience } from 'src/assets/audiance';

export interface DialogData {
  audience: string;
  condition: string;
  role: string;
  task: string;
  taskId: string;
  degree: string;
  effectiveness: string;
}

@Component({
  selector: 'app-competencies-dashboard',
  templateUrl: './competencies-dashboard.component.html',
  styleUrls: ['./competencies-dashboard.component.scss']
})
export class CompetenciesDashboardComponent implements OnInit {

  competency!: DialogData;
  user!: any;

  competencies: any = [];

  // Workroles and Tasks
  niceFramework: any[] = Object.values(behavior);
  // Academic Audience
  audience: any[] = Object.values(audience);

  // Applied filters
  selected: { role: string[]; audience: string[], task: string[] } = {
    role: [],
    audience: [],
    task: []
  };

  // Boolean toggle for 'clear filters' button
  filterApplied: boolean = false;

  constructor(
    public dialog: MatDialog,
    public competencyService: CompetencyService,
    public authService: AuthService,
    private router: Router,
    ) { }

  async ngOnInit() {
    await this.getCompetencies();
    this.user = this.authService.user;
    
    // Push unsaved/non-academic audiences to audience array
    this.audience.push("working Professional","intern")
  }

  async getCompetencies() {
    this.competencies = await this.competencyService.getAllCompetencies()
  }

  async createCompetency(competency: any) {
    await this.competencyService.createCompetency(competency);
  }

  async updateCompetency(competency: any) {
    await this.competencyService.lockCompetency(competency, false);
    await this.competencyService.editCompetency(competency);
  }

  async lockCompetency(competency: any) {
    await this.competencyService.lockCompetency(competency, true);
  }

  async unlockCompetency(competency: any) {
    await this.competencyService.lockCompetency(competency, false);
  }

  // Apply filter to results list
  addFilter(facet: string, type: number): void {
    if(type === 1) {
      if (!this.selected.role.includes(facet)){
        this.selected.role.push(facet);
      }
    } else if (type === 2) {
      if(!this.selected.audience.includes(facet)){
        this.selected.audience.push(facet);
      }
    } else if (type === 3) {
      if (!this.selected.task.includes(facet)){
        this.selected.task.push(facet);
      }
    }
    this.filter();
    this.filterApplied = true;
  }

  // Get filtered competencies
  async filter() {
    this.competencies = await this.competencyService.getAllCompetencies(this.selected)
  }

  // Clear filters and reset index
  async clearFilters() {
    this.selected.role = [];
    this.selected.audience = [];
    this.selected.task = [];
    this.filterApplied = false;
    this.competencies = await this.competencyService.getAllCompetencies(this.selected);
  }

  openCompetencyBuilder(competency?: any) {
    let authorId = "";
    if (this.authService.user) {
      authorId = this.authService.user._id;
    }
    let data = {
      _id: "",
      audience: "",
      role: "",
      task: "",
      taskId: "",
      condition: "",
      degree: "",
      effectiveness: "",
      author: authorId,
      locked: false,
      lastUpdate: Date.now()
    }
    if(competency) {
      data = competency;
      this.lockCompetency(competency);
    }
    const dialogRef = this.dialog.open(CompetencyBuilderComponent, {
      height: '700px',
      width: '900px',
      data: data
    });

    dialogRef.afterClosed().subscribe(async(result) => {
      if (competency && result !== undefined) {
        await this.updateCompetency(result);
      } else if (result !== undefined) {
        await this.createCompetency(result);
      } else if (result === undefined) {
        /**
         * not currently in use - california 3/2022
         * 
         * await this.unlockCompetency(competency);
         */
      }
      await this.getCompetencies();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'comptency-builder',
  templateUrl: 'competency-builder.html',
  styleUrls: ['./competencies-dashboard.component.scss']
})
/**
 * Componet to build and submit competencies
 */
export class CompetencyBuilderComponent implements DoCheck{
  constructor(
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  // Boolean to disable submission button
  isDisabled: boolean = true;
  // Boolean to toggle error message
  errorMessage: boolean = false;

  /**
   * FORM CONTROLS
   */
  audience = new FormControl('', [Validators.required]);
  condition = new FormControl('', [Validators.required]);
  role = new FormControl('', [Validators.required]);
  task = new FormControl('', [Validators.required]);
  degree = new FormControl('', [Validators.required]);
  effectiveness = new FormControl('', [Validators.required]);
  // Index of selected formatted task for mapped ids and tasks
  taskIndex = new FormControl(null, [Validators.required]);
  
  // Audiance groups (academic only)
  academia = Object.values(audience)
  // NICE Framwork Workroles and Tasks
  niceFramework: any = Object.values(behavior);
  // Formatted Dropdown Tasks
  workroleTasks: any = [];
  // Mapped NICE Tasks
  currentTasks: any = [];
  // Mapped Task Ids
  currentTaskIds: any = [];

  /**
   * Function to handle exit of builder
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Function to continusouly check form element values
   */
  ngDoCheck(): void {
    this.checkData();
  }

  /**
   * Function to set a formatted tasks list based on current selected workrole and
   * to also store the task id and description in their own arrarys
   * ^^^Did this so theres no regex^^^
   */
  setTasks(): void {
    // clear all arrays
    this.workroleTasks = [];
    this.currentTaskIds = [];
    this.currentTasks = [];
    // clear task index
    this.taskIndex.setValue(-1);
    // format and push task description and id for each array
    this.niceFramework.map((frame: any) => {
      if (frame.workrole === this.role.value) {
        frame.tasks.map((task: any) => {
          this.workroleTasks.push(task.id + ' - ' + task.task)
          this.currentTaskIds.push(task.id);
          this.currentTasks.push(task.task);
        })
      }
    });
  }

  /**
   * Function to set task description and id to the competency
   */
  setTaskMeta(): void {
    this.data.task = this.currentTasks[this.taskIndex.value];
    this.data.taskId = this.currentTaskIds[this.taskIndex.value];
  }

  /**
   * Function to send an error message for the specific dialog box
   * 
   * @param obj Form control element where error occured
   * @returns error message for form element
   */
  getErrorMessage(obj: FormControl): string {
    switch (obj) {
      case this.audience:
        return "You must select an audience!";
      case this.condition:
        return "You must provide a condition for the competency!";
      case this.role:
        return "You must select a workrole for the competency!";
      case this.task:
        return "You must select a task for the competency!";
      case this.degree:
        return "You must define the degree for the competency!";
      case this.effectiveness:
        return "You must define the effectiveness of the competency!";
      default:
        return "Something went wrong, please refresh the page and try again...";
    }
  }

  /**
   * Function to toggle error messages and submission button
   */
  checkData(): void {
    // Check to ensure all fileds are completed to enable submission button
    if (
      this.data.audience !== '' &&
      this.data.role !== '' &&
      this.data.task !== '' &&
      this.data.condition !== '' &&
      this.data.degree !== '' &&
      this.data.effectiveness !== ''
    ) {
      this.errorMessage = false;
      this.isDisabled = false;
    }

    // Check to ensure submission button is disabled if a field becomes empty after intially touched
    if (
      this.data.audience == '' ||
      this.data.role == '' ||
      this.data.task == '' ||
      this.data.condition == '' ||
      this.data.degree == '' ||
      this.data.effectiveness == ''
    ) {
      this.isDisabled = true;
    }

    // After a form element has been touched, check if the data values are empty strings
    // If they are empty, show the warning message, otherwise disable the warning message
    if (
      (this.data.audience == '' && this.audience.value == '' && this.audience.touched) ||
      (this.data.role == '' && this.role.value == '' && this.role.touched) ||
      (this.data.task == '' && this.task.value == '' && this.task.touched) ||
      (this.data.condition == '' && this.condition.value == '' && this.condition.touched) ||
      (this.data.degree == '' && this.degree.value == '' && this.degree.touched) ||
      (this.data.effectiveness == '' && this.effectiveness.value == '' && this.effectiveness.touched)
    ) {
      this.errorMessage = true;
    } else {
      this.errorMessage = false;
    }
  }
}
