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
import { BuilderOptions } from '../builder.directive';
import { fade } from '../builder.animations';
@Component({
  selector: 'cc-builder-viewer',
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
        <button
          *ngIf="options.showExitButton"
          class="side-panel__exit-button"
          [style.color]="options.exitButtonColor"
          (click)="closePanel()"
        >
          <i class="fal fa-times">X</i>
        </button>
        <ng-content></ng-content>
      </div>
    </ng-container>
  `,
  styleUrls: ['./builder-viewer.component.scss'],
  animations: [fade],
})
export class BuilderViewerComponent implements OnInit, OnDestroy {
  @HostBinding('@fade') fadeAnimation = true;

  // tslint:disable-next-line: variable-name
  _controller$!: BehaviorSubject<boolean>;
  contentWidth = 400;

  options!: BuilderOptions;

  isOpen = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<any>();
  defaultCloseParam: any;

  private defaultWidth = 350;
  private destroyed$: Subject<void> = new Subject();

  constructor() {}

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

  ngOnInit(): void {
    this.close.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.isOpen = false;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
