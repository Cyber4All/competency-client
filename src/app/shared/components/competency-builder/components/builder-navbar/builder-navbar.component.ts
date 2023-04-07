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
  subSelection = 'Description';

  constructor(
    public builderService: BuilderService,
  ) { }

  ngOnInit(): void {
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });
  }
  isSubActive(selected: string): boolean{
    return this.subSelection === selected;
  }
  subselect(selected: string){
    this.subSelection=selected;
  }
}
