import { Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../../../../../core/builder/builder.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { each } from 'jquery';

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
  isHighlighted = {
    actor: true, // LearningObjects starts highlighted
    behavior: false,
    context: false,
    degree: false,
    employability: false,
    notes: false,
    review: false,
  };
  selection = 'actor';
  subSelection = 'Description';

  constructor(
    public builderService: BuilderService,
  ) { }

  ngOnInit(): void {
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });
  }
  isOtherChoiceSelected() {
    return Object.values(this.isHighlighted).every((isSelected) => !isSelected);
  }
  isActive(selected: string): boolean{
    return this.selection === selected;
  }
  isSubActive(selected: string): boolean{
    return this.subSelection === selected;
  }
  select(selected: string) {
    this.selection=selected;
    if(selected === 'Context' || 'Degree'){
      this.subSelection = 'Description';
    }
  }
  subselect(selected: string){
    this.subSelection=selected;
  }
}
