import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompetencyService } from 'src/app/core/competency.service';
import { Degree } from 'src/entity/degree';
@Component({
  selector: 'cc-degree-card',
  templateUrl: './degree-card.component.html',
  styleUrls: ['./degree-card.component.scss']
})
export class DegreeCardComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() degree!: Degree;
  @Output() degreeChange = new EventEmitter<{update: string, value: Degree}>();
  currIndex: number | null = null;
  complete = new FormControl('');
  correct = new FormControl('');
  time = new FormControl('');

  constructor(
    private competencyService: CompetencyService
  ) { }

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

  /**
   * Method to advance to next step
   */
   async updateDegree() {
    if(this.complete.valid && this.correct.valid && this.time.valid) {
      const res: any = await this.competencyService.updateDegree(
        this.competencyId,
        {
          _id: this.degree._id,
          correct: this.correct.value,
          complete: this.complete.value,
          time: this.time.value
        }
      );
    }
  }
}
