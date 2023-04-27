import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/core/auth.service';
import { CompetencyService, sleep } from 'app/core/competency.service';
import { Competency } from 'entity/Competency';
import { Lifecycles } from 'entity/Lifecycles';
import { Search } from 'entity/Search';
import { DropdownType } from 'entity/dropdown';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'cc-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  // Logic to load and display competency cards
  loading = true;
  loadedCompetencies: Competency[] = [];
  search: Search = {
    competencies: [],
    limit: 12,
    page: 1,
    total: 0
  };
  currPage = 1;

  unsubscribe: Subject<void> = new Subject();

  // Logic to display the competency preview
  previewCompetency: Competency;
  openPreview = false;

  constructor(
    private authService: AuthService,
    private competencyService: CompetencyService,
    private route: ActivatedRoute
  ) { }

  dropdownType = DropdownType;

  // Selected Filters
  selectedStatuses: string[] = [];
  selectedWorkroles: string[] = [];
  selectedTasks: string[] = [];
  selectedAudiences: string[] = [];

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(async params => {
      this.currPage = params.page ? +params.page : 1;
      this.makeQuery(params);
      await this.initDashboard();
    });
  }

  /**
   * Method to toggle loading state and load competencies
   */
  async initDashboard() {
    this.loading = true;
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
          limit: q ? q.limit : this.search.limit,
          page:  q ? q.page : this.search.page,
          author: this.authService.user?._id,
          status: [
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
        total: 0
      };
    }
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


  filter() {
    // TODO: Implement filtering
    // Emit the selected filters
    // this.filterCompetencies.emit({
      //   status: this.selectedStatuses,
      //   workrole: this.selectedWorkroles,
      //   task: this.selectedTasks,
      //   audience: this.selectedAudiences
      // });
    }

    // Functions to set the selected filters upon change
    statuses(statuses: string[]) {
      this.selectedStatuses = statuses;
      this.filter();
    }
    workroles(workroles: string[]) {
      this.selectedWorkroles = workroles;
      this.filter();
    }
    tasks(tasks: string[]) {
      this.selectedTasks = tasks;
      this.filter();
    }
    audiences(audiences: string[]) {
      this.selectedAudiences = audiences;
      this.filter();
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
}
