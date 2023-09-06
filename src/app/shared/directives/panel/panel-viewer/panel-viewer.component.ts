import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  HostBinding,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PanelOptions } from '../panel.directive';
import { fade } from '../panel.animations';
import { Lifecycles } from '../../../entity/lifecycles';
import { Elements } from '../../../entity/nice.elements';
import { Workrole } from '../../../entity/nice.workrole';
import { FrameworkService } from '../../../../core/framework.service';
import { DCWF_Element } from '../../../entity/dcwf.elements';
import { DCWF_Workrole } from '../../../entity/dcwf.workrole';
@Component({
  selector: 'cc-panel-viewer',
  template: `
    <ng-container>
      <div *ngIf="isOpen" (click)="closePanel()" [@fade] class="overlay"></div>
      <div
        trapfocus
        [style.width]="contentWidth + 'px'"
        (click)="$event.stopPropagation()"
        class="side-panel"
        [ngClass]="{
          'center': options.position === 'center',
          'lower-right': options.position === 'lower-right',
          'side-panel--no-padding': options && !options.padding
        }"
      >
        <div class="side-panel__header" *ngIf="!options.isAdmin else adminHeader">
          <h3 class="side-panel__title">{{ options.title }}</h3>
          <div class="side-panel__buttons">
            <div
              *ngIf="options.showDeleteButton"
              class="side-panel__delete-button"
              (click)="deleteCompetency()"
            >
              <i class="fal fa-trash-alt"></i>
            </div>
            <div
              *ngIf="options.showExitButton"
              class="side-panel__exit-button"
              [style.color]="options.exitButtonColor"
              (click)="closePanel()"
            >
              <i class="fal fa-times"></i>
            </div>
          </div>
        </div>
        <ng-content></ng-content>
      </div>
    </ng-container>

    <ng-template #adminHeader>
      <div class="admin header" [ngClass]="options.competency.status.toString()">
        <div class="left-corner" *ngIf="tasks[0] && workrole">
          <h2>{{ workrole }} - {{ tasks[0].element_id }} </h2>
          <p><b>Task: </b> {{ tasks[0].element_id }} - {{ tasks[0].description }}</p>
        </div>
        <div class="right-corner">
          <div class="status">
            <i [ngClass]="competencyStatusIcon()"></i>
            <p><b>{{ options.competency.status | titlecase }}</b></p>
          </div>
          <button (click)="close.emit()">
            <i class="far fa-times fa-2x"></i>
          </button>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./panel-viewer.component.scss'],
  animations: [fade],
})
export class PanelViewerComponent implements OnInit, OnDestroy {
  @HostBinding('@fade') fadeAnimation = true;

  // tslint:disable-next-line: variable-name
  _controller$!: BehaviorSubject<boolean>;
  contentWidth = 400;

  options!: PanelOptions;

  isOpen = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  defaultCloseParam: any;

  private defaultWidth = 350;
  private destroyed$: Subject<void> = new Subject();

  workrole!: Workrole | DCWF_Workrole;
  tasks: (Elements | DCWF_Element)[] = [];

  constructor(
    private frameworkService: FrameworkService,
  ) { }

  /**
   * Calculate the speed necessary to open the side panel
   *
   * @readonly
   * @memberof SidePanelViewerComponent
   */
  get openSpeed(): number {
    return 350 + (this.contentWidth - this.defaultWidth) * 0.3;
  }

  /**
   * Calculate the speed necessary to close the side panel
   *
   * @readonly
   * @memberof SidePanelViewerComponent
   */

  get closeSpeed(): number {
    return 250 + (this.contentWidth - this.defaultWidth) * 0.3;
  }

  closePanel(): void {
    if (this.defaultCloseParam) {
      this.close.emit(this.defaultCloseParam);
    } else {
      this.close.emit();
    }
  }

  deleteCompetency(): void {
    this.delete.emit();
  }

  async ngOnInit(): Promise<void> {
    if (this.options.competency.behavior.source) {
      this.frameworkService.currentFramework = this.options.competency.behavior.source;
    }
    if (this.options.competency.behavior.work_role) {
      this.workrole = await this.frameworkService.getCompleteWorkrole(this.options.competency.behavior.work_role);
    }
    // load tasks
    if (this.options.competency.behavior.tasks.length > 0) {
      const tasks = this.options.competency.behavior.tasks.map(async (task) => await this.frameworkService.getCompleteTask(task));
      await Promise.all(tasks)
        .then((tasks: (Elements | DCWF_Element)[]) => {
          this.tasks = tasks;
        });
    }
    this.close.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.isOpen = false;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }

  /**
   * Returns an icon to display depending on competency status
   * Only for admin view
   *
   * @returns A FontAwesome icon
   */
  competencyStatusIcon(): string {
    switch (this.options.competency.status) {
      case Lifecycles.DRAFT:
        return 'far fa-file-edit fa-2x';
      case Lifecycles.SUBMITTED:
        return 'far fa-file-exclamation fa-2x';
      case Lifecycles.PUBLISHED:
        return 'far fa-file-check fa-2x';
      case Lifecycles.DEPRECATED:
        return 'far fa-file-minus fa-2x';
      case Lifecycles.REJECTED:
        return 'far fa-file-times fa-2x';
    }
  }
}
