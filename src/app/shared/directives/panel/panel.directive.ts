import {
  Directive,
  ElementRef,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  EmbeddedViewRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { PanelViewerComponent } from './panel-viewer/panel-viewer.component';
import {
  AnimationBuilder,
  AnimationStyleMetadata,
  AnimationAnimateMetadata,
  AnimationPlayer,
} from '@angular/animations';
import { fadeIn, fadeOut, slideIn, slideOut } from './panel.animations';
import { Subject } from 'rxjs';
import { Competency } from '../../entity/competency';
export interface PanelOptions {
  padding: boolean;
  showExitButton: boolean;
  showDeleteButton: boolean;
  title: string;
  exitButtonColor: 'white' | 'black';
  position: 'lower-right' | 'center';
  isAdmin: boolean;
  competency: Competency;
}
@Directive({
  selector: '[ccPanel]'
})
export class PanelDirective implements OnInit, OnDestroy {
  viewer!: ComponentRef<PanelViewerComponent>;

  @Input()
  contentWidth!: number;
  @Input()
  options!: PanelOptions;
  @Input() defaultCloseParam: any;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  animationElement: HTMLElement | undefined;

  private destroyed$ = new Subject<void>();

  constructor(
    private host: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private builder: AnimationBuilder
  ) { }

  ngOnInit(): void {
    // remove the original element from the DOM so it doesn't duplicate
    this.host.nativeElement.remove();

    // initialize the viewer object with a new instance of SidePanelViewerComponent
    this.viewer = this.componentFactoryResolver
      .resolveComponentFactory(PanelViewerComponent)
      .create(this.injector, [[this.host.nativeElement]]);

    this.viewer.instance.contentWidth = this.contentWidth;
    this.viewer.instance.options = this.options;

    this.viewer.instance.close = this.close;
    this.viewer.instance.defaultCloseParam = this.defaultCloseParam;

    this.viewer.instance.delete = this.delete;

    // Attach to the angular component tree, this doesn't add it to the DOM
    this.appRef.attachView(this.viewer.hostView);

    // append viewer element to the DOM
    const domElem = (this.viewer.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    this.host.nativeElement.addEventListener(
      'SidePanelCloseEvent',
      (e: CustomEvent) => {
        this.close.emit(e.detail);
        this.host.nativeElement.removeEventListener(
          'SidePanelCloseEvent',
          (_: CustomEvent) => { }
        );
      }
    );

    document.body.appendChild(domElem);
    this.animationElement = domElem.querySelectorAll(
      '.side-panel'
    )[0] as HTMLElement;

    // animate side panel on
    const player = this.animate(this.options.position === 'center' ? fadeIn : slideIn);
    player.onDone(() => {
      player.destroy();
    });
  }

  closePanel(): void {
    if (typeof this.defaultCloseParam !== 'undefined') {
      this.close.emit(this.defaultCloseParam);
    } else {
      this.close.emit();
    }
  }

  deleteCompetency(): void {
    this.delete.emit();
  }

  ngOnDestroy(): void {
    // animate side panel off
    const player = this.animate(this.options.position === 'center' ? fadeOut : slideOut);

    // give the animation time to complete
    setTimeout(() => {
      // destroy the view
      this.appRef.detachView(this.viewer.hostView);
      this.viewer.destroy();
      player.destroy();

      this.destroyed$.next();
      this.destroyed$.unsubscribe();
    }, 650);
  }

  animate(
    animation: (AnimationStyleMetadata | AnimationAnimateMetadata)[]
  ): AnimationPlayer {
    const factory = this.builder.build(animation);
    const player = factory.create(this.animationElement);

    player.play();

    return player;
  }
}
