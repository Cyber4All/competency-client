import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CompetencyService } from '../core/competency.service';

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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  competency!: DialogData;
  user!: any;

  competencies: any = [];

  // Workroles and Tasks
  // niceFramework: any[] = Object.values(behavior);
  // Academic Audience
  // audience: any[] = Object.values(audience);

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
    // this.audience.push("working Professional","intern")
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

  // openCompetencyBuilder(competency?: any) {
  //   let authorId = "";
  //   if (this.authService.user) {
  //     authorId = this.authService.user._id;
  //   }
  //   let data = {
  //     _id: "",
  //     audience: "",
  //     role: "",
  //     task: "",
  //     taskId: "",
  //     condition: "",
  //     degree: "",
  //     effectiveness: "",
  //     author: authorId,
  //     locked: false,
  //     lastUpdate: Date.now()
  //   }
  //   if(competency) {
  //     data = competency;
  //     this.lockCompetency(competency);
  //   }
  //   const dialogRef = this.dialog.open(CompetencyBuilderComponent, {
  //     height: '700px',
  //     width: '900px',
  //     data: data
  //   });

  //   dialogRef.afterClosed().subscribe(async(result) => {
  //     if (competency && result !== undefined) {
  //       await this.updateCompetency(result);
  //     } else if (result !== undefined) {
  //       await this.createCompetency(result);
  //     } else if (result === undefined) {
  //       /**
  //        * not currently in use - california 3/2022
  //        * 
  //        * await this.unlockCompetency(competency);
  //        */
  //     }
  //     await this.getCompetencies();
  //   });
  // }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
