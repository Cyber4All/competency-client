import { Component, Input, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Degree } from 'src/entity/degree';
@Component({
  selector: 'cc-degree-card',
  templateUrl: './degree-card.component.html',
  styleUrls: ['./degree-card.component.scss']
})
export class DegreeCardComponent implements OnInit, DoCheck {

  @Input() isEdit = false;
  @Input() currIndex: number | null = null;
  @Input() degree!: Degree;
  @Output() degreeChange = new EventEmitter<{update: string, value: Degree}>();
  @Output() setIndex = new EventEmitter<number>();
  @Output() nextView = new EventEmitter();
  @Output() prevView = new EventEmitter();
  complete = new FormControl('', [Validators.required]);
  correct = new FormControl('', [Validators.required]);
  time = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
    // If value exists, set type form control
    if(this.degree.complete) {
      this.complete.patchValue(this.degree.complete);
    }
    // If value exists, set details form control
    if (this.degree.time) {
      this.time.patchValue(this.degree.time);
    }
    // If value exists, set workrole form control
    if (this.degree.correct) {
      this.correct.patchValue(this.degree.correct);
    }
  }

  ngDoCheck(): void {
    // If any value updates, update parent component
    if(this.complete.value || this.correct.value || this.time.value) {
      this.degreeChange.emit({
        update: 'degree',
        value: {
          _id: this.degree._id,
          complete: this.complete.value,
          correct: this.correct.value,
          time: this.time.value
        }
      });
    };
  }

  /**
   * Method to set view of builder element
   *
   * @param val value of current builder element
   */
   setStep(val: number) {
    this.setIndex.emit(val);
  }

  /**
   * Method to advance to next step
   */
  nextStep() {
    if(this.complete.valid && this.correct.valid && this.time.valid) {
      this.nextView.emit();
    }
  }

  prevStep() {
    this.prevView.emit();
  }

}
