import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordionTogglePosition } from '@angular/material/expansion';
import { CompetencyService } from 'src/app/core/competency.service';
import { Audience } from 'src/entity/audience';
import { Behavior } from 'src/entity/behavior';
import { Condition } from 'src/entity/condition';
import { Degree } from 'src/entity/degree';
import { Employability } from 'src/entity/employability';

@Component({
  selector: 'cc-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent implements OnInit {
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
    private competencyService: CompetencyService,
  ) {
    this.competencyId = COMPETENCY.data.competency._id;
  }

  ngOnInit(): void {
    this.competencyService.build.subscribe((index: number | null) => {
      if(index !== null) {
        this.currIndex = index;
      }
    });
  }

  /**
   * Need NICE Framework workroles
   * Need NICE Tasks based on workroles^
   */

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
        this.COMPETENCY.data.competency.audience = event.value as Audience;
        break;
      case 'behavior':
        this.COMPETENCY.data.competency.behavior = event.value as Behavior;
        break;
      case 'condition':
        this.COMPETENCY.data.competency.condition = event.value as Condition;
        break;
      case 'degree':
        this.COMPETENCY.data.competency.degree = event.value as Degree;
        break;
      case 'employability':
        this.COMPETENCY.data.competency.employability = event.value as Employability;
        break;
      default:
        console.log('yo you messed up dawg');
        break;
    }
  }
}
