import { AfterViewInit, Component, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CompetencyService } from '../core/competency.service';
import { Competency } from '../../entity/competency';
import { Lifecycles } from '../../entity/lifecycles';
import { Search } from '../../entity/search';
import { sleep } from '../shared/functions/loading';
import { BuilderService } from '../core/builder/builder.service';
import { CompetencyBuilder } from '../core/builder/competency-builder.class';
import { CompetencyBuilderComponent } from '../shared/components/competency-builder/competency-builder.component';
import { WorkroleService } from '../core/workrole.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SnackbarService } from '../core/snackbar.service';
@Component({
  selector: 'cc-competencies-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
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
  currPage = 1;
  // Applied filters
  selected: { work_role: string[]; task: string[] } = {
    work_role: [],
    task: []
  };
  // Boolean toggle for 'clear filters' button
  filterApplied = false;
  unsubscribe: Subject<void> = new Subject();
  // Builder vars
  newCompetency!: CompetencyBuilder;
  openBuilder = false;
  openPreview = false;

  isAdmin!: boolean;

  constructor(
    private competencyService: CompetencyService,
    private builderService: BuilderService,
    private authService: AuthService,
    private workRoleService: WorkroleService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: SnackbarService
  ) { }

  async ngAfterViewInit() {
    await this.authService.validateAdminAccess();
    this.authService.isAdmin.subscribe((res) => {
      this.isAdmin = res;
    });
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
    await sleep(1800);
    await this.getCompetencies(this.search);
    await this.loadCompetencies();
    this.loading = false;
  }

  /**
   * WORK-IN-PROGRESS
   * Method to retrieve competencies based on a users permissions
   * Authors: retrieve all DRAFT and REJECTED competencies by default
   * Admins: retrieve SUBMITTED competencies by default and an admins DRAFTS
   *
   * @param q the search query object
   */
  async getCompetencies(q?: Search) {
    this.search.competencies = [];
    if(this.authService.user?._id !== undefined) {
      // Retrieve author competencies
      this.search = await this.competencyService
        .getAllCompetencies({
          limit: q?.limit,
          page: q?.page,
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
   * Method to navigate to dashboard with query params
   *
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
    await sleep(1800);
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
   * Method to retrieve some fields for each found competency
   */
  async loadCompetencies() {
    if(this.search.competencies.length > 0) {
      this.search.competencies.map(async (comp: Competency) => {
        await this.competencyService.getCompetencyCard(comp._id)
          .then(async (comp: Competency) => {
            // load workrole
            comp.behavior.work_role = await this.workRoleService.getCompleteWorkrole(comp.behavior.work_role)
            .then((workroleQuery: any) => {
              return workroleQuery.data.workrole.work_role;
            });
            // load tasks
            const tasks = comp.behavior.tasks.map(async (task) => await this.workRoleService.getCompleteTask(task)
            .then((taskQuery: any) => {
              return taskQuery.data.task.description;
              }));
            comp.behavior.tasks = await Promise.all(tasks);
            this.loadedCompetencies.push(comp);
          });
      });
    }
  }
    // navigate to previous page
    prevPage() {
      const page = +this.currPage - 1;
      if (page > 0) {
        this.currPage = page;
        this.navigateDashboard();
      }
    }

    // navigate to next page
    nextPage() {
      const page = +this.currPage + 1;
      if (page <= this.search.page) {
        this.currPage = page;
        this.navigateDashboard();
      }
    }
    // navigate to a numbered page
    goToPage(page: number) {
      if (page > 0 && page <= this.search.page) {
        this.currPage = page;
        this.navigateDashboard();
      }
    }

  get pages(): number[] {
    const totalPages = this.search.total / this.search.limit;
    const pageCount = this.search.page;
    const cursor = +this.currPage;
    let count = 1;
    let upCount = 1;
    let downCount = 1;
    const arr = [cursor];

    if (this.loadedCompetencies.length) {
      while (count < totalPages) {
        if (cursor + upCount <= pageCount) {
          arr.push(cursor + upCount++);
          count++;
        }
        if (cursor - downCount > 0) {
          arr.unshift(cursor - downCount++);
          count++;
        }
      }
    } else {
      return [];
    }

    return arr;
  }

  // /**
  //  * NOT CURRENTLY IN USE - WORK IN PROGRESS
  //  * Method to apply filters for competencies
  //  *
  //  * @param facet
  //  * @param type
  //  */
  // addFilter(facet: string, type: number): void {
  //   if(type === 1) {
  //     if (!this.selected.work_role.includes(facet)){
  //       this.selected.work_role.push(facet);
  //     }
  //   } else if (type === 3) {
  //     if (!this.selected.task.includes(facet)){
  //       this.selected.task.push(facet);
  //     }
  //   }
  //   this.filter();
  //   this.filterApplied = true;
  // }

  performSearch(searchText: any) {
    //TODO Actually perform the search
    console.log(searchText);
  }

  /**
   * Perform a search based on the filters selected from the secondary navbar component
   *
   * @param filter object containing arrays of selected filters
   */
  async filter(filter: { status: string[], workrole: string[], task: string[], audience: string[]}) {
    console.log('FILTER BASED SEARCHING NOT IMPLEMENTED YET.', filter);
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
    // CompetencyBuilder used in case the user opens the builder in the competency preview
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
