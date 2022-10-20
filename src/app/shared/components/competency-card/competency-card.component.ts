import { Component, DoCheck, Inject, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Audience } from 'src/entity/Audience';
import { Behavior } from 'src/entity/Behavior';
import { Competency } from 'src/entity/Competency';
import { Condition } from 'src/entity/Condition';
import { Degree } from 'src/entity/Degree';
import { Employability } from 'src/entity/Employability';

@Component({
  selector: 'cc-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent implements DoCheck {
  // Toggle for editing a competency
  @Input() isEdit = true;
  /**MOVING FORM CONTROLS OUT TO COMPONENTS */
  behavior = new FormControl({}, [Validators.required]);
  condition = new FormControl({}, [Validators.required]);
  degree = new FormControl({}, [Validators.required]);
  employability = new FormControl({}, [Validators.required]);
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
    @Inject(MAT_DIALOG_DATA) public data: Competency
  ) {}

  /**
   * Need audience groups
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
        this.data.audience = event.value as Audience;
        break;
      case 'behavior':
        this.data.behavior = event.value as Behavior;
        break;
      case 'condition':
        this.data.condition = event.value as Condition;
        break;
      case 'degree':
        this.data.degree = event.value as Degree;
        break;
      case 'employability':
        this.data.employability = event.value as Employability;
        break;
      default:
        console.log('yo wtf check yo shit');
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
