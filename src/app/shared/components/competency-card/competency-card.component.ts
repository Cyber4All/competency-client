import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordionTogglePosition } from '@angular/material/expansion';
import { Audience } from '../../../../entity/Audience';
import { Behavior } from '../../../../entity/Behavior';
import { Competency } from '../../../../entity/Competency';
import { Condition } from '../../../../entity/Condition';
import { Degree } from '../../../../entity/Degree';
import { Employability } from '../../../../entity/Employability';

@Component({
  selector: 'cc-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent implements OnInit {
  @Input() competency!: Competency;
  // Toggle for editing a competency
  @Input() isEdit = true;
  // Current Competency ID
  competencyId = '';
  // Index to toggle cards *** Null closes all cards
  compIndex: number | null = null;
  // Index of current open card component
  currIndex = 0;
  position: MatAccordionTogglePosition = 'before';

  constructor(
    public dialogRef: MatDialogRef<CompetencyCardComponent>,
    @Inject(MAT_DIALOG_DATA) public COMPETENCY: any,
  ) {}

  ngOnInit(): void {
    if(!this.competency) {
      this.competency = this.COMPETENCY.data.competency;
    }
    this.competencyId = this.competency.id;
  }

  /**
   * Opens selected builder view and closes last opened
   *
   * @param index location of selected builder element
   */
  setView(index: number | null): void {
    this.compIndex = index;
  }

  /**
   * Function to handle exit of builder
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Parent method to update attributes of a competency
   *
   * @param event is an event from the child componenet updating part of the competency
   * @update <string> is the competency attribute being updated
   * @value <Object> is the attribute type with updated fields
   */
  updateCompetency(
    event: {
      update: string,
      value: Audience | Behavior | Condition | Degree | Employability
    }
  ): void {
    switch(event.update) {
      case 'audience':
        this.competency.audience = event.value as Audience;
        break;
      case 'behavior':
        this.competency.behavior = event.value as Behavior;
        break;
      case 'condition':
        this.competency.condition = event.value as Condition;
        break;
      case 'degree':
        this.competency.degree = event.value as Degree;
        break;
      case 'employability':
        this.competency.employability = event.value as Employability;
        break;
      default:
        console.log('yo you messed up dawg');
        break;
    }
  }
}
