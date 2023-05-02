import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { BuilderService } from '../../../../../core/builder.service';
import { BuilderValidation } from '../../../../../../entity/builder-validation';

@Component({
  selector: 'cc-builder-navbar',
  templateUrl: './builder-navbar.component.html',
  styleUrls: ['./builder-navbar.component.scss'],
  animations: [
    trigger('isHighlighed', [
      state('highlighted', style({
        backgroundColor: '#E9F0FE',
        color: '#376ED6',
        fontWeight: 600,
      })),
      state('notHighlighted', style({
        color: '#AAAAAA'
      })),
      transition('isHighlighted => notHighlighted', [
        animate('4s')
      ]),
      transition('notHightlighted => isHighlighted', [
        animate('4s')
      ])
    ])
  ]
})
export class BuilderNavbarComponent implements OnInit {
  currIndex!: number;
  actorErrors: BuilderValidation[] = [];
  behaviorErrors: BuilderValidation[] = [];
  conditionErrors: BuilderValidation[] = [];
  degreeErrors: BuilderValidation[] = [];
  employabilityErrors: BuilderValidation[] = [];
  constructor(
    public builderService: BuilderService,
  ) { }

  ngOnInit(): void {
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });
    this.builderService.actorErrors.subscribe((errors: BuilderValidation[]) => {
      this.actorErrors = errors;
    });
    this.builderService.behaviorErrors.subscribe((errors: BuilderValidation[]) => {
      this.behaviorErrors = errors;
    });
    this.builderService.contextErrors.subscribe((errors: BuilderValidation[]) => {
      this.conditionErrors = errors;
    });
    this.builderService.degreeErrors.subscribe((errors: BuilderValidation[]) => {
      this.degreeErrors = errors;
    });
    this.builderService.employabilityErrors.subscribe((errors: BuilderValidation[]) => {
      this.employabilityErrors = errors;
    });
  }
}
