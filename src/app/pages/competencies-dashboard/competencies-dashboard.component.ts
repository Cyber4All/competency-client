import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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

  competencies = [
    {
      _id: "123455",
      audience: "The student",
      behavior: "diagnose network connectivity problem(4 -T0081) and fix",
      condition: "acting as a Network operations specialist and given a network with with a connectivity issue, will",
      degree: "Within 30 minutes",
      effectiveness: "in keeping with best practices",
      author: "",
      locked: false,
      lastUpdate: Date.now()
    },
    {
      _id: "98765",
      audience: "The student",
      behavior: "diagnose network connectivity problem(4 -T0081) and fix",
      condition: "acting as a Network operations specialist and given a network with with a connectivity issue, will",
      degree: "Within 30 minutes",
      effectiveness: "in keeping with best practices",
      author: "",
      locked: false,
      lastUpdate: Date.now()
    }
  ]
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCompetencies();
  }

  getCompetencies() {
    console.log("I will call the service");
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
    }
    const dialogRef = this.dialog.open(CompetencyBuilderComponent, {
      height: '700px',
      width: '600px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Baby baby baby', result);
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
