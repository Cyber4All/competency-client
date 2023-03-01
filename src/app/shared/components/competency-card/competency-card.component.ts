import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordionTogglePosition } from '@angular/material/expansion';
import { Competency } from '../../../../entity/competency';

@Component({
  selector: 'cc-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent implements OnInit {
  @Input() competency!: Competency;

  constructor(
    public dialogRef: MatDialogRef<CompetencyCardComponent>,
    @Inject(MAT_DIALOG_DATA) public COMPETENCY: Competency,
  ) {}

  ngOnInit(): void {
    if(!this.competency) {
      this.competency = this.COMPETENCY;
    }
  }
}
