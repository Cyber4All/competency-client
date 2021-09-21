import { Component, Inject, OnInit } from '@angular/core';
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
export class CompetencyBuilderComponent {
  constructor(
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
