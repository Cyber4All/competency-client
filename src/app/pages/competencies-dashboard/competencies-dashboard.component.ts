import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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

  constructor(public dialog: MatDialog, public competencyService: CompetencyService) { }

  async ngOnInit() {
    await this.getCompetencies();
  }

  async getCompetencies() {
    return;
    // this.competencies = await this.competencyService.getAllCompetencies()
  }

  async createCompetency(competency: any) {
    console.log(competency);
    await this.competencyService.createCompetency(competency);
  }

  async updateCompetency(competency: any) {
    console.log(competency);
    await this.competencyService.editCompetency(competency);
    await this.competencyService.lockCompetency(competency, false);
  }

  async lockCompetency(competency: any) {
    console.log('locking baby')
    await this.competencyService.lockCompetency(competency, true);
  }

  openCompetencyBuilder(competency?: any) {
    let data = {
      _id: "",
      audience: "",
      behavior: "",
      condition: "",
      degree: "",
      effectiveness: "",
      author: "",
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

    dialogRef.afterClosed().subscribe(result => {
      if(competency) {
        this.updateCompetency(result);
      } else {
        this.createCompetency(result);
      }
      this.getCompetencies()
    });
  }
}


@Component({
  selector: 'comptency-builder',
  templateUrl: 'competency-builder.html',
  styleUrls: ['./competencies-dashboard.component.scss']
})
export class CompetencyBuilderComponent {
  constructor(
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
