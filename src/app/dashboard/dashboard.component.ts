import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { sleep, CompetencyService } from '../core/competency.service';
import { CompetencyCardComponent } from '../shared/components/competency-card/competency-card.component';
import { Competency } from '../../entity/competency';
import { Lifecycles } from '../../entity/lifecycles';
import { Search } from '../../entity/search';
@Component({
  selector: 'cc-competencies-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() isSavable!: boolean;
  // Loading visual for competency list
  loading = true;
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
  ) { }

  async ngOnInit() {
    await this.initDashboard();
  }

  /**
   * Method to toggle loading state and load competencies
   */
  async initDashboard() {
    this.loading = true;
    await sleep(1800);
    await this.getCompetencies();
    await this.loadCompetencies();
    this.loading = false;
  }

  /**
   * WORK-IN-PROGRESS
   * Method to retrieve competencies based on a users permissions
   * Authors: retrieve all DRAFT and REJECTED competencies by default
   * Admins: retrieve SUBMITTED competencies by default and an admins DRAFTS
   */
  async getCompetencies() {
    if(this.authService.user?._id !== undefined) {
      // Retrieve author competencies
      this.search = await this.competencyService
        .getAllCompetencies({
          author: this.authService.user?._id,
          status: [`${Lifecycles.DRAFT}`, `${Lifecycles.REJECTED}`]
        });
    } else {
      this.search = {
        competencies: [],
        limit: 0,
        page: 0,
        total: 0
      };
    }
  }

  /**
   * Method to retrieve all fields for each found competency
   */
  async loadCompetencies() {
    if(this.search.competencies.length > 0) {
      this.search.competencies.map(async (comp: Competency) => {
        await this.competencyService.getCompetencyById(comp._id)
          .then((comp: Competency) => {
            this.loadedCompetencies.push(comp);
          });
      });
    }
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

  performSearch(searchText: any) {
    console.log(searchText);
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
    // Enforce loading state
    this.loading = true;
    this.selected.work_role = [];
    this.selected.task = [];
    this.filterApplied = false;
    await this.initDashboard();
  }

  /**
   * Method to delete an entire competency and reset loaded competncy arrays
   *
   * @param competencyId
   */
  async deleteCompetency(competencyId: string) {
    // Enforce loading state
    this.loading = true;
    await this.competencyService.deleteCompetency(competencyId);
    this.search.competencies = [];
    this.loadedCompetencies = [];
    await this.initDashboard();
  }

  /**
   * Method to open the competency-card component and build a competency
   *
   * @param existingCompetency - Opens the builder with a pre-selected competency
   */
  async openCompetencyBuilder(existingCompetency?: Competency) {
    let competency!: Competency;
    // If !existingCompetency; we are creating a new competency object
    if(!existingCompetency) {
      // Create competency shell
      const competencyShellId: any = await this.competencyService.createCompetency();
      // Retrieve full competency object
      const competencyQuery: any = await this.competencyService.getCompetencyById(competencyShellId.id);
      // Deconstruct GraphQL response
      competency = competencyQuery;
    } else {
      // Competency existed; we are opening builder from dashboard
      competency = existingCompetency;
    }
    // Open dialog ref for builder
    const dialogRef = this.dialog.open(CompetencyCardComponent, {
      height: '700px',
      width: '900px',
      data: competency
    });
    // After close of builder; handle drafts/unsavable and dashboard list
    dialogRef.afterClosed().subscribe(async (isDraft: boolean) => {
      // Enforce loading state
      this.loading = true;
      if((isDraft === undefined && !this.isSavable) || !isDraft) {
        // Competency is neither savable nor being saved as draft; delete shell
        await this.deleteCompetency(competency._id);
        this.search.competencies = [];
        this.loadedCompetencies = [];
        await this.initDashboard();
      } else if (isDraft) {
        // Update user dashboard with newly created competencies
        this.search.competencies = [];
        this.loadedCompetencies = [];
        await this.initDashboard();
      } else {
        // isDraft can be undefined; Throw a toaster error stating something went wrong.
      }
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
