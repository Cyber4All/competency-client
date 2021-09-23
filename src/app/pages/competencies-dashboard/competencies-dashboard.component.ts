import { Component, DoCheck, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CompetencyService } from '../../core/competency.service';

export interface DialogData {
  audience: string;
  condition: string;
  behavior: string;
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

  competencies: any = [];

  constructor(
    public dialog: MatDialog,
    public competencyService: CompetencyService,
    public authService: AuthService,
    private router: Router,
    ) { }

  async ngOnInit() {
    await this.getCompetencies();
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

  openCompetencyBuilder(competency?: any) {
    let authorId = "";
    if (this.authService.user) {
      authorId = this.authService.user._id;
    }
    let data = {
      _id: "",
      audience: "",
      behavior: "",
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
      width: '600px',
      data: data
    });

    dialogRef.afterClosed().subscribe(async(result) => {
      if (competency && result !== undefined) {
        await this.updateCompetency(result);
      } else if (result !== undefined) {
        await this.createCompetency(result);
      } else if (result === undefined) {
        await this.unlockCompetency(competency);
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
export class CompetencyBuilderComponent implements DoCheck{
  constructor(
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  isDisabled: boolean = true;
  errorMessage: boolean = false;

  audience = new FormControl('', [Validators.required]);
  condition = new FormControl('', [Validators.required]);
  behavior = new FormControl('', [Validators.required]);
  degree = new FormControl('', [Validators.required]);
  unit = new FormControl('', [Validators.required])
  effectiveness = new FormControl('', [Validators.required])

  academia = ["doctorial candidate", "graduate student", "undergraduate student", "12th grade student", "11th grade student", "10th grade student", "9th grade student", "8th grade student", "7th grade student", "6th grade student", "5th grade student", "4th grade student", "3rd grade student", "2nd grade student", "1st grade student", "kindergarten student"]

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Function to continusouly check form element values
   */
  ngDoCheck() {
    this.checkData();
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
      case this.behavior:
        return "You must provide the behavior of the competency!";
      case this.degree:
        return "You must define the degree of the competency!";
      case this.effectiveness:
        return "You must define the effectiveness of the competency!";
      default:
        return "Something went wrong, please refresh the page and try again...";
    }
  }

  processData() {
    console.log("hit")
    this.data.degree = this.data.degree + " " + this.unit.value;
    return this.data;
  }

  checkData(): void {
    // Check to ensure all fileds are completed to enable submission button
    if (
      this.data.audience !== '' &&
      this.data.behavior !== '' &&
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
      this.data.behavior == '' ||
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
      (this.data.behavior == '' && this.behavior.value == '' && this.behavior.touched) ||
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
