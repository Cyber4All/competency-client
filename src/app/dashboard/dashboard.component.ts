import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CompetencyService } from '../core/competency.service';
import { CompetencyCardComponent } from '../shared/components/competency-card/competency-card.component';
import { Competency } from '../../entity/Competency';
import { Lifecycles } from '../../entity/Lifecycles';
import { WorkroleService } from '../core/workrole.service';
import { Search } from '../../entity/Search';
@Component({
  selector: 'cc-competencies-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Logged in user
  user!: any;
  // Loading visual for competency list
  loading = false;
  // Array of complete competency objects
  loadedCompetencies: Competency[] = [];
  // Object for search results
  search: Search = {
    competencies: [],
    limit: 0,
    page: 0,
    total: 0
  };
  // Applied filters
  selected: { work_role: string[]; task: string[] } = {
    work_role: [],
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
    this.loading = true;
    if(!this.user) {
      this.user = this.authService.user;
    }
    await this.getCompetencies();
    await this.loadCompetencies();
  }

  /**
   * WORK-IN-PROGRESS
   * Method to retrieve competencies based on a users permissions
   * Authors: retrieve all DRAFT and REJECTED competencies by default
   * Admins: retrieve SUBMITTED competencies by default and an admins DRAFTS
   */
  async getCompetencies() {
    await this.competencyService
      .getAllCompetencies({
        author: this.user.id, //replace this with your user id when you register
        status: [`${Lifecycles.DRAFT}`, `${Lifecycles.REJECTED}`]
      })
      .then((res: any) => {
        this.search = res.data.search;
      });
  }

  /**
   * Method to retrieve all fields for each found competency
   */
  async loadCompetencies(): Promise<any> {
    if(this.search.competencies.length > 0) {
      this.search.competencies.map(async (comp: Competency) => {
        await this.competencyService.getCompetencyById(comp._id)
          .then((res: any) => {
            this.loadedCompetencies.push(res.data.competency);
          });
      });
    }
    // Toggle for loading spinner
    this.loading = false;
  }

  /**
   * NOT CURRENTLY IN USE - WORK IN PROGRESS
   * Method to apply filters for competencies
   *
   * @param facet
   * @param type
   */
  addFilter(facet: string, type: number): void {
    if(type === 1) {
      if (!this.selected.work_role.includes(facet)){
        this.selected.work_role.push(facet);
      }
    } else if (type === 3) {
      if (!this.selected.task.includes(facet)){
        this.selected.task.push(facet);
      }
    }
    this.filter();
    this.filterApplied = true;
  }

  /**
   * Method to find competencies by specified filters
   */
  async filter() {
    console.log('METHOD NOT CURRENTLY IMPLEMENTED');
  }

  /**
   * Method to clear applied filters
   */
  async clearFilters() {
    this.loading = true;
    this.selected.work_role = [];
    this.selected.task = [];
    this.filterApplied = false;
    await this.getCompetencies();
    await this.loadCompetencies();
    this.loading = false;
  }

  /**
   * Method to open the competency-card component and build a competency
   *
   * @param existingCompetency - Opens the builder with a pre-selected competency
   */
  async openCompetencyBuilder(existingCompetency?: Competency) {
    let competency: any = existingCompetency;
    if(!existingCompetency) {
      const res: any = await this.competencyService.createCompetency();
      competency = await this.competencyService.getCompetencyById(res.id);
    }
    // Open dialog ref for builder
    const dialogRef = this.dialog.open(CompetencyCardComponent, {
      height: '700px',
      width: '900px',
      data: competency
    });
    // After close of builder; refresh list of competencies
    dialogRef.afterClosed().subscribe(async (result) => {
      this.loading = true;
      await this.getCompetencies();
      await this.loadCompetencies();
      this.loading = false;
    });
  }

  /**
   * Method to log a user out and refresh the page view
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
