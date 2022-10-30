import { Component, DoCheck, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AudienceService } from 'src/app/core/audience.service';
import { BehaviorService } from 'src/app/core/behavior.service';
import { ConditionService } from 'src/app/core/condition.service';
import { DegreeService } from 'src/app/core/degree.service';
import { EmployabilityService } from 'src/app/core/employability.service';
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
export class CompetencyCardComponent implements DoCheck {
  // Toggle for editing a competency
  @Input() isEdit = true;

  // Index to toggle cards *** Null closes all cards
  compIndex: number | null = null;
  // Index of current open card component
  currIndex = 0;
  // Boolean to disable submission button
  isDisabled = true;
  // Boolean to toggle error message
  errorMessage = false;

  constructor(
    public dialogRef: MatDialogRef<CompetencyCardComponent>,
    @Inject(MAT_DIALOG_DATA) public COMPETENCY: any,
    private audService: AudienceService,
    private behService: BehaviorService,
    private conService: ConditionService,
    private degService: DegreeService,
    private empService: EmployabilityService
  ) {}

  /**
   * Need NICE Framework workroles
   * Need NICE Tasks based on workroles^
   */

  /**
   * Opens selected builder view and closes last opened
   *
   * @param index location of selected builder element
   */
  setView(index: number): void {
    this.compIndex = index;
  }

  /**
   * Advances to next builder element
   */
  nextView(): void {
    if(typeof this.compIndex === 'number') {
      this.compIndex++;
    }
  }

  /**
   * Returns to previous builder element
   */
  prevView(): void {
    if(typeof this.compIndex === 'number') {
      this.compIndex--;
    }
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
        const audienceUpdate = event.value as Audience;
        this.COMPETENCY.data.competency.audience = audienceUpdate;
        //this.audService
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

  /**
   * Function to continusouly check form element values
   */
  ngDoCheck(): void {
    this.checkData();
  }

  /**
   * Function to toggle error messages and submission button
   */
  checkData(): void {
    // Check to ensure all fileds are completed to enable submission button
    // if (
    //   typeof this.data.audience !== 'Audience' &&
    //   this.data.role !== '' &&
    //   this.data.task !== '' &&
    //   this.data.condition !== '' &&
    //   this.data.degree !== '' &&
    //   this.data.effectiveness !== ''
    // ) {
    //   this.errorMessage = false;
    //   this.isDisabled = false;
    // }

    // // Check to ensure submission button is disabled if a field becomes empty after intially touched
    // if (
    //   this.data.audience === '' ||
    //   this.data.role === '' ||
    //   this.data.task === '' ||
    //   this.data.condition === '' ||
    //   this.data.degree === '' ||
    //   this.data.effectiveness === ''
    // ) {
    //   this.isDisabled = true;
    // }

    // // After a form element has been touched, check if the data values are empty strings
    // // If they are empty, show the warning message, otherwise disable the warning message
    // if (
    //   (this.data.audience === '' && this.audience.value === '' && this.audience.touched) ||
    //   (this.data.condition === '' && this.condition.value === '' && this.condition.touched) ||
    //   (this.data.degree === '' && this.degree.value === '' && this.degree.touched) ||
    //   (this.data.effectiveness === '' && this.employability.value === '' && this.employability.touched)
    // ) {
    //   this.errorMessage = true;
    // } else {
    //   this.errorMessage = false;
    // }
  }
}
