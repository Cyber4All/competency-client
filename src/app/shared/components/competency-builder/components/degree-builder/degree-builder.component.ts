import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BuilderValidation } from '../../../../../../entity/builder-validation';
import { Degree } from '../../../../../../entity/degree';
import { BuilderService } from '../../../../../core/builder/builder.service';
@Component({
  selector: 'cc-degree-builder',
  templateUrl: './degree-builder.component.html',
  styleUrls: ['./degree-builder.component.scss']
})
export class DegreeBuilderComponent implements OnInit {

  @Input() degree!: Degree;
  @Output() degreeChange = new EventEmitter<{update: string, value: Degree}>();
  degreeErrors: BuilderValidation[] = [];
  templateIndex = 0;
  complete = new FormControl('');
  correct = new FormControl('');
  time = new FormControl('');

  constructor(
    public builderService: BuilderService
  ) {}

  ngOnInit(): void {
    // Subscribe to degree errors
    this.builderService.degreeErrors.subscribe((errors: BuilderValidation[]) => {
      errors.map((error: BuilderValidation) => {
        // If error is not already in local degreeErrors array, add it
        if (this.degreeErrors.findIndex((degreeError: BuilderValidation) => {
          return degreeError.attribute === error.attribute;
        }) === -1) {
          this.degreeErrors.push(error);
        }
        // Set form validation errors
        this.displayErrors();
      });
    });
    // Subscribe to degree template index
    this.builderService.templateIndex.subscribe((index: number) => {
      this.templateIndex = index;
    });
    // Subscribe to complete form control
    this.complete.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((completeChange: string) => {
        // Remove complete error from degreeErrors array
        this.degreeErrors = this.degreeErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'complete';
        });
        this.complete.setErrors({error: false});
        // Emit degree complete change to parent builder component
        this.degreeChange.emit({
          update: 'degree',
          value: {
            _id: this.degree._id,
            complete: completeChange,
            correct: this.degree.correct,
            time: this.degree.time
          }
        });
      });
    // Subscribe to correct form control
    this.correct.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((correctChange: string) => {
        // Remove correct error from degreeErrors array
        this.degreeErrors = this.degreeErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'correct';
        });
        this.correct.setErrors({error: false});
        // Emit degree correct change to parent builder component
        this.degreeChange.emit({
          update: 'degree',
          value: {
            _id: this.degree._id,
            complete: this.degree.complete,
            correct: correctChange,
            time: this.degree.time
          }
        });
      });
    // Subscribe to time form control
    this.time.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((timeChange) => {
        // Remove time error from degreeErrors array
        this.degreeErrors = this.degreeErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'time';
        });
        this.time.setErrors({error: false});
        // Emit degree time change to parent builder component
        this.degreeChange.emit({
          update: 'degree',
          value: {
            _id: this.degree._id,
            complete: this.degree.complete,
            correct: this.degree.correct,
            time: timeChange
          }
        });
      });
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

  displayErrors(): void {
    // Iterate through degreeErrors
    this.degreeErrors.map((error: BuilderValidation) => {
      // If error is for complete, set complete form control error
      if (error.attribute === 'complete') {
        this.complete.setErrors({error: true});
      }
      // If error is for correct, set correct form control error
      if (error.attribute === 'correct') {
        this.correct.setErrors({error: true});
      }
      // If error is for time, set time form control error
      if (error.attribute === 'time') {
        this.time.setErrors({error: true});
      }
    });
  }
}
