import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CompetencyService } from '../core/competency.service';
import { Competency } from '../../entity/Competency';
import { Lifecycles } from '../../entity/Lifecycles';
import { Search } from '../../entity/Search';
import { sleep } from '../shared/functions/loading';
import { BuilderService } from '../core/builder.service';
import { CompetencyBuilder } from '../../entity/builder.class';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SnackbarService } from '../core/snackbar.service';
import { SNACKBAR_COLOR } from '../shared/components/snackbar/snackbar.component';
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
    limit: 12,
    page: 1,
    total: 0,
    statuses: []
  };
  urlParams: Record<string, string> = {};
  // Pagination default val
  currPage = 1;
  // Applied filters
  selected: { work_role: string[]; task: string[] } = {
    work_role: [],
    task: []
  };
  searchText = '';
  // Boolean toggle for 'clear filters' button
  filterApplied = false;
  unsubscribe: Subject<void> = new Subject();
  // Builder vars
  builderCompetency!: CompetencyBuilder;
  previewCompetency!: Competency;
  openBuilder = false;
  openPreview = false;
  // Boolean to disable `NEW COMPETENCY` button
  disabled = false;

  constructor(
    private competencyService: CompetencyService,
    private builderService: BuilderService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) { }

  async ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(async params => {
      this.urlParams = params;
      this.makeQuery(params);
    });
    await this.initDashboard();
  }

  /**
   * Method to toggle loading state and load competencies
   */
  async initDashboard() {
    this.loading = true;
    this.search = {
      competencies: [],
      limit: 12,
      page: 1,
      total: 0,
      statuses: []
    };
    if (this.urlParams) {
      this.makeQuery(this.urlParams);
    }
    await sleep(1000);
    await this.getCompetencies(this.search);
    await this.loadCompetencies();
    this.loading = false;
  }

  /**
   * Method to query user competencies
   *
   * @param q the search query object
   */
  async getCompetencies(q?: Search) {
    // Explicitly clear competencies array
    this.search.competencies = [];
    // Check if user is logged in
    if(this.authService.user?._id !== undefined) {
      // Retrieve author competencies
      this.search = await this.competencyService
        .getAllCompetencies({
          text: this.searchText,
          limit: q ? q.limit : this.search.limit,
          page:  q ? q.page : this.search.page,
          author: this.authService.user?._id,
          status: (q && q.statuses.length > 0) ? q.statuses : [
            `${Lifecycles.DRAFT}`,
            `${Lifecycles.REJECTED}`,
            `${Lifecycles.SUBMITTED}`,
            `${Lifecycles.PUBLISHED}`
          ]
        });
    } else {
      // User is not logged in, clear search object, display no results
      this.search = {
        competencies: [],
        limit: 12,
        page: 1,
        total: 0,
        statuses: []
      };
    }
  }

  /**
   * Method to navigate to dashboard with query params
   */
  async navigateDashboard() {
    const params = {
      limit: this.search.limit,
      page: this.currPage
    };
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['dashboard'], {
      queryParams: params
    });
    window.scrollTo(0, 0);
    await sleep(1000);
    this.currPage = params.page;
  }

  /**
   * Method to update the query params in the url
   *
   * @param params the query params from the url
   */
  makeQuery(params: Record<string, string>) {
    if (params.page) {
      this.search.page = +params.page;
    }
    if (params.limit) {
      this.search.limit = +params.limit;
    } else {
      this.search.limit = 12;
    }
    this.currPage = params.page ? +params.page : 1;
  }

  /**
   * Method to retrieve all fields for each found competency
   */
  async loadCompetencies() {
    this.loadedCompetencies = [];
    if(this.search.competencies.length > 0) {
      this.search.competencies.map(async (comp: Competency) => {
        await this.competencyService.getCompetencyById(comp._id)
          .then(async (comp: Competency) => {
            this.loadedCompetencies.push(comp);
          });
      });
    }
  }

  /**
   * Navigate to previous page
   */
  prevPage() {
    const page = +this.currPage - 1;
    if (page > 0) {
      this.currPage = page;
      this.navigateDashboard();
    }
  }

  /**
   * Navigate to next page
   */
  nextPage() {
    const page = +this.currPage + 1;
    if (page <= this.search.page) {
      this.currPage = page;
      this.navigateDashboard();
    }
  }
  /**
   * Navigate to a numbered page
   *
   * @param page target page
   */
  goToPage(page: number) {
    if (page > 0 && page <= this.search.page) {
      this.currPage = page;
      this.navigateDashboard();
    }
  }

  get pages(): number[] {
    const totalPages = this.search.total / this.search.limit;
    const pageCount = this.search.page;
    let count = 1;
    let upCount = 1;
    let downCount = 1;
    const arr = [this.currPage];

    while (count < totalPages) {
      if (this.currPage + upCount <= pageCount) {
        arr.push(this.currPage + upCount++);
        count++;
      }
      if (this.currPage - downCount > 0) {
        arr.unshift(this.currPage - downCount++);
        count++;
      }
    }
    return arr;
  }

  performSearch(searchText: any) {
    if (searchText.target?.value!) {
      this.searchText = searchText.target.value;
      this.initDashboard();
    }
  }

  /**
   * Perform a search based on the filters selected from the secondary navbar component
   *
   * @param filter object containing arrays of selected filters
   */
  async filter(filter: { status: string[], workrole: string[], task: string[], audience: string[]}) {
    this.loading = true;
    // filter competencies by status
    this.search.statuses = filter.status;
    await this.getCompetencies(this.search);
    await this.loadCompetencies();
    this.filterApplied = true;
    this.loading = false;
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
   * Method to delete a competency and reset the dashboard
   *
   * @param competencyId
   */
  async deleteCompetency(competencyId: string) {
    // Enforce loading state
    this.loading = true;
    // If competency preview is open, close it
    if(this.openPreview) {
      this.openPreview = false;
    }
    // If competency builder is open, close it
    if(this.openBuilder) {
      this.openBuilder = false;
    }
    // Delete competency
    await this.competencyService.deleteCompetency(competencyId);
    await this.initDashboard();
    // Release button disabled state (if it was disabled)
    if (this.disabled) {
      this.disabled = false;
    }
  }

  openHelp() {
    //TODO Open help dialog
    // Oliver Twist reference
    console.log('PLEASE SIR, MAY I HAVE SOME MORE SIR?');
  }

  /**
   * Method to open the competency-card component and build a competency
   *
   * @param existingCompetency - Opens the builder with a pre-selected competency
   */
  async openCompetencyBuilder(existingCompetency?: Competency) {
    // Enforce button disabled state
    this.disabled = true;
    // If !existingCompetency; we are creating a new competency object
    if(!existingCompetency) {
      // Create competency shell
      const competencyShellId: any = await this.builderService.createCompetency();
      // Retrieve full competency object
      existingCompetency = await this.competencyService.getCompetencyById(competencyShellId.id);
    }
    // Create new instance of competency builder
    this.builderCompetency = new CompetencyBuilder(
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

  async closeBuilder() {
    // Enforce loading state
    this.loading = true;
    this.openBuilder = false;
    if(
      !this.builderCompetency.actor.type &&
      !this.builderCompetency.behavior.work_role &&
      this.builderCompetency.behavior.tasks.length === 0 &&
      !this.builderCompetency.condition.scenario &&
      !this.builderCompetency.condition.limitations &&
      this.builderCompetency.condition.tech.length === 0 &&
      !this.builderCompetency.degree.complete &&
      !this.builderCompetency.degree.correct &&
      !this.builderCompetency.degree.time &&
      !this.builderCompetency.employability.details
    ) {
      // Competency is neither savable nor being saved as draft; delete shell
      await this.deleteCompetency(this.builderCompetency._id);
      this.snackbarService.notification$.next({
        message: 'Competency was missing minimum fields to be saved as a draft.',
        title: 'Draft Deleted',
        color: SNACKBAR_COLOR.WARNING
      });
    } else {
      // Update user dashboard with newly created competencies
      await this.initDashboard();
    }
    // Release button disabled state
    this.disabled = false;
  }

  /**
   * Logic to trigger the Competency Preview component to open
   *
   * @param competency The competency to preview
   */
  async openCompetencyPreview(competency: Competency) {
    this.previewCompetency = competency;
    this.openPreview = true;
  }

  /**
   * Closes the Competency Preview component
   */
  closePreview() {
    this.openPreview = false;
  }

  /**
   * Method to log a user out and refresh the page view
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
