import { Component, Input, OnInit } from '@angular/core';
import { Competency } from '../../../../entity/competency';
import { Lifecycles } from '../../../../entity/lifecycles';

@Component({
  selector: 'cc-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent implements OnInit {
  @Input() competency!: Competency;
  lifecycle = Lifecycles;

  constructor() {}

  ngOnInit(): void {}
}
