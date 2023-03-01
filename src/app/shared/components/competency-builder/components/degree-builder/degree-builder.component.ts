import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
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
  templateIndex = 0;
  complete = new FormControl('');
  correct = new FormControl('');
  time = new FormControl('');

  constructor(
    public builderService: BuilderService
  ) {}

  ngOnInit(): void {
    this.builderService.templateIndex.subscribe((index: number) => {
      this.templateIndex = index;
    });
    this.complete.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((completeChange: string) => {
        this.degreeChange.emit({
          update: 'degree',
          value: {
            _id: this.degree._id,
            complete: completeChange,
            correct: this.correct.value,
            time: this.time.value
          }
        });
      });
    this.correct.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((correctChange: string) => {
        this.degreeChange.emit({
          update: 'degree',
          value: {
            _id: this.degree._id,
            complete: this.complete.value,
            correct: correctChange,
            time: this.time.value
          }
        });
      });
    this.time.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((timeChange) => {
        this.degreeChange.emit({
          update: 'degree',
          value: {
            _id: this.degree._id,
            complete: this.complete.value,
            correct: this.correct.value,
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
}
