import { Component, Input, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Employability } from 'src/entity/employability';
@Component({
  selector: 'cc-employability-card',
  templateUrl: './employability-card.component.html',
  styleUrls: ['./employability-card.component.scss']
})
export class EmployabilityCardComponent implements OnInit, DoCheck {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() currIndex: number | null = null;
  @Input() employability!: Employability;
  @Output() employabilityChange = new EventEmitter<{update: string, value: Employability}>();
  @Output() setIndex = new EventEmitter<number>();
  @Output() nextView = new EventEmitter();
  @Output() prevView = new EventEmitter();
  details = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    // If any value updates, update parent component
    if(this.details.value) {
      this.employabilityChange.emit({
        update: 'employability',
        value: {
          _id: this.employability._id,
          details: this.details.value
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
    if(this.details.valid) {
      this.nextView.emit();
    }
  }

  prevStep() {
    this.prevView.emit();
  }

}
