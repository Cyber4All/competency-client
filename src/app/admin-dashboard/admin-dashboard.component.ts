import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { BuilderService } from '../core/builder.service';
import { CompetencyService } from '../core/competency.service';
import { SnackbarService } from '../core/snackbar.service';
import { SNACKBAR_COLOR } from '../shared/components/snackbar/snackbar.component';
import { Competency } from '../shared/entity/competency';
import { Lifecycles } from '../shared/entity/lifecycles';
import { Search } from '../shared/entity/search';
import { CompetencyBuilder } from '../shared/entity/builder.class';
import { DropdownType } from '../shared/entity/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { Source } from '../shared/entity/behavior';

@Component({
  selector: 'cc-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  isAdmin = false;
  // Logic to load and display competency cards
  loading = true;
  loadedCompetencies: Competency[] = [];
  search: Search = {
    competencies: [],
    limit: 12,
    page: 1,
    total: 0,
    statuses: []
  };
  currPage = 1;
  // Applied filters
  selected: { work_role: string[]; task: string[] } = {
    work_role: [],
    task: []
  };
  unsubscribe: Subject<void> = new Subject();

  // Logic to display the competency preview and builder
  builderCompetency!: CompetencyBuilder;
  previewCompetency: Competency;
  openBuilder = false;
  openPreview = false;
  filterApplied = false;
  // Boolean to disable `NEW COMPETENCY` button
  disabled = false;

  constructor(
    private authService: AuthService,
    private competencyService: CompetencyService,
    private route: ActivatedRoute,
    private router: Router,
    private builderService: BuilderService,
    private snackbarService: SnackbarService
  ) { }

  dropdownType = DropdownType;
  areFiltersCleared = true;
  frameworkSource = undefined as Source | undefined;
  // Text Search
  query = '';
  // Selected Filters
  selectedStatuses: string[] = [];
  selectedWorkroles: string[] = [];
  selectedSource: string[] = [];
  selectedTasks: string[] = [];
  selectedActor: string[] = [];

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(async params => {
      this.currPage = params.page ? +params.page : 1;
      this.makeQuery(params);
      await this.initDashboard();
    });
    this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  /**
   * Method to toggle loading state and load competencies
   */
  async initDashboard() {
    this.loading = true;
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
    // Retrieve author competencies
    this.search = await this.competencyService
      .getAllCompetencies({
        text: this.query,
        limit: q ? q.limit : this.search.limit,
        page: q ? q.page : this.search.page,
        status: (q && q.statuses.length > 0) ? q.statuses : [
          `${Lifecycles.SUBMITTED}`,
          `${Lifecycles.PUBLISHED}`,
          `${Lifecycles.DEPRECATED}`
        ],
        workrole: this.selectedWorkroles,
        task: this.selectedTasks,
      });
  }

  /**
   * Method to retrieve all fields for each found competency
   */
  async loadCompetencies() {
    this.loadedCompetencies = [];
    if (this.search.competencies.length > 0) {
      this.search.competencies.map(async (comp: Competency) => {
        await this.competencyService.getCompetencyById(comp._id)
          .then(async (comp: Competency) => {
            this.loadedCompetencies.push(comp);
          });
      });
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
    this.router.navigate(['/admin/dashboard'], {
      queryParams: params
    });
    window.scrollTo(0, 0);
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
    if (params.currPage) {
      this.currPage = +params.currPage;
    }
  }

  /**
   * Perform a search based on the filters selected from the secondary navbar component
   *
   * @param filter object containing arrays of selected filters
   */
  async filter(filter: { status: string[], workrole: string[], task: string[], audience: string[] }) {
    this.loading = true;
    // Explicitly clear search object
    this.search = {
      competencies: [],
      limit: 12,
      page: 1,
      total: 0,
      statuses: []
    };
    // apply filters
    this.search.statuses = filter.status;
    this.selected.work_role = filter.workrole;

    await this.getCompetencies(this.search);
    await this.loadCompetencies();

    this.filterApplied = true;
    this.loading = false;
  }

  // Method to perform a text based search
  performSearch(query: any) {
    if (query.target?.value!) {
      this.query = query.target.value;
      this.initDashboard();
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

  /**
   * In case a Delete Competency event occurs, it will throw an error to the user
   * informing them that admins are not allowed to delete any competencies.
   *
   * @param competencyId
   */
  async deleteCompetencyError() {
    this.snackbarService.notification$.next({
      title: 'Error',
      message: 'You cannot delete this competency!',
      color: SNACKBAR_COLOR.WARNING,
    });
  }

  /**
   * Method to open the preview-competency component and edit a submitted competency
   *
   * @param existingCompetency - Opens the builder with a pre-selected competency
   */
  async openCompetencyBuilder(existingCompetency?: Competency) {
    // If !existingCompetency; we are creating a new competency object
    if (!existingCompetency) {
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
    await this.initDashboard();
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
   * When an admin updates the status of a competency in the preview, reset the dashboard
   */
  async handleStatusUpdated() {
    this.search.competencies = [];
    this.loadedCompetencies = [];
    await this.initDashboard();
  }
}
