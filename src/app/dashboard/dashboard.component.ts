/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CompetencyService } from '../core/competency.service';
import { Competency } from '../../entity/competency';
import { Lifecycles } from '../../entity/lifecycles';
import { Search } from '../../entity/search';
import { sleep } from '../shared/functions/loading';
import { BuilderService } from '../core/builder/builder.service';
import { CompetencyBuilder } from '../core/builder/competency-builder.class';
import { SnackbarService } from '../core/snackbar.service';
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
  // Builder vars
  newCompetency!: CompetencyBuilder;
  openBuilder = false;
  openPreview = false;

  isAdmin!: boolean;

  constructor(
    private dialog: MatDialog,
    private competencyService: CompetencyService,
    private builderService: BuilderService,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService
  ) { }

  async ngOnInit() {
    await this.initDashboard();
    await this.authService.validateAdminAccess();
    this.authService.isAdmin.subscribe((res) => {
      this.isAdmin = res;
    });
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
          status: [`${Lifecycles.DRAFT}`, `${Lifecycles.SUBMITTED}`, `${Lifecycles.PUBLISHED}`,
           `${Lifecycles.DEPRECATED}`, `${Lifecycles.REJECTED}`]
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
    //TODO Actually perform the search
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
    // If !existingCompetency; we are creating a new competency object
    if(!existingCompetency) {
      // Create competency shell
      const competencyShellId: any = await this.builderService.createCompetency();
      // Retrieve full competency object
      existingCompetency = await this.competencyService.getCompetencyById(competencyShellId.id);
    }
    // Create new instance of competency builder
    this.newCompetency = new CompetencyBuilder(
      existingCompetency._id,
      existingCompetency.status,
      existingCompetency.authorId,
      existingCompetency.version,
      existingCompetency.actor,
      existingCompetency.behavior,
      existingCompetency.condition,
      existingCompetency.degree,
      existingCompetency.employability,
      existingCompetency.notes
    );
    this.openBuilder = true;
  }

  async closeBuilder(isDraft: any) {
    // Enforce loading state
    this.loading = true;
    this.openBuilder = false;
    if(!isDraft && isDraft !== undefined) {
      // Competency is neither savable nor being saved as draft; delete shell
      await this.deleteCompetency(this.newCompetency._id);
    } else {
      // Update user dashboard with newly created competencies
      this.search.competencies = [];
      this.loadedCompetencies = [];
      await this.initDashboard();
    }
  }

  /**
   * Logic to trigger the Competency Preview component to open
   *
   * @param competency The competency to preview
   */
  async openCompetencyPreview(competency: Competency) {
    this.newCompetency = new CompetencyBuilder(
      competency._id,
      competency.status,
      competency.authorId,
      competency.version,
      competency.actor,
      competency.behavior,
      competency.condition,
      competency.degree,
      competency.employability,
      competency.notes
    );
    this.openPreview = true;
  }

  /**
   * Closes the Competency Preview component
   */
  closePreview() {
    this.openPreview = false;
  }

  /**
   * When an admin updates the status of a competency in the preview, reset the dashboard
   */
  async handleStatusUpdated() {
    this.search.competencies = [];
    this.loadedCompetencies = [];
    await this.initDashboard();
  }

  /**
   * Method to log a user out and refresh the page view
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
