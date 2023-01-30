import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompetencyService } from '../../../../../../app/core/competency.service';
import { Degree } from '../../../../../../entity/degree';
@Component({
  selector: 'cc-degree-builder',
  templateUrl: './degree-builder.component.html',
  styleUrls: ['./degree-builder.component.scss']
})
export class DegreeBuilderComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() degree!: Degree;
  @Output() degreeChange = new EventEmitter<{update: string, value: Degree}>();
  @Output() degreeUpdated = new EventEmitter<boolean>(false);
  currIndex: number | null = null;
  complete = new FormControl('');
  correct = new FormControl('');
  time = new FormControl('');

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

  ngOnChanges(): void {
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
}
