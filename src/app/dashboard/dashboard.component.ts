import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CompetencyService } from '../core/competency.service';
import { CompetencyCardComponent } from '../shared/components/competency-card/competency-card.component';
import { Competency } from 'src/entity/competency';
import { Lifecycles } from 'src/entity/lifecycles';
import { WorkroleService } from '../core/workrole.service';
@Component({
  selector: 'cc-competencies-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  competency!: Competency;
  user!: any;

  competencies: any = [];

  // Applied filters
  selected: { role: string[]; audience: string[], task: string[] } = {
    role: [],
    audience: [],
    task: []
  };

  // Boolean toggle for 'clear filters' button
  filterApplied = false;

  constructor(
    private dialog: MatDialog,
    private competencyService: CompetencyService,
    private authService: AuthService,
    private router: Router,
    private workroleService: WorkroleService
    ) { }

  async ngOnInit() {
    this.getCompetencies();
    this.user = this.authService.user;
    // console.log("hitting graph for workrole")
    // await this.workroleService.getCompleteWorkrole("635fc5be14f517aa6aef0116")
    // console.log("getting all workroles");
    // await this.workroleService.getAllWorkroles();
    // console.log("getting all tasks");
    // await this.workroleService.getAllTasks();
    console.log(this.authService.user);
  }

  async getCompetencies() {
    if(this.authService.user) {
      await this.competencyService
        .getAllCompetencies({
          author: this.authService.user?._id,
          status: [`${Lifecycles.DRAFT}`, `${Lifecycles.REJECTED}`, `${Lifecycles.PUBLISHED}`]
        })
        .then((res: any) => {
        });
    }

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
    //this.competencies = await this.competencyService.getAllCompetencies(this.selected);
  }

  // Clear filters and reset index
  async clearFilters() {
    this.selected.role = [];
    this.selected.audience = [];
    this.selected.task = [];
    this.filterApplied = false;
    this.competencies = await this.competencyService.getAllCompetencies();
  }

  async openCompetencyBuilder(existingCompetency?: Competency) {
    const res: any = await this.competencyService.createCompetency();
    let competency: Competency = await this.competencyService.getCompetencyById(res.id);
    if(existingCompetency) {
      competency = existingCompetency;
    }
    const dialogRef = this.dialog.open(CompetencyCardComponent, {
      height: '700px',
      width: '900px',
      data: competency
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (competency && result !== undefined) {
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
