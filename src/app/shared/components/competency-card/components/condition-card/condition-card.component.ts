import { Component, Input, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Condition } from 'src/entity/condition';
@Component({
  selector: 'cc-condition-card',
  templateUrl: './condition-card.component.html',
  styleUrls: ['./condition-card.component.scss']
})
export class ConditionCardComponent implements DoCheck {

  @Input() isEdit = false;
  @Input() currIndex: number | null = null;
  @Input() condition!: Condition;
  @Output() conditionChange = new EventEmitter<{update: string, value: Condition}>();
  @Output() setIndex = new EventEmitter<number>();
  @Output() nextView = new EventEmitter();
  @Output() prevView = new EventEmitter();
  tech = new FormControl({}, [Validators.required]);
  limitations = new FormControl('', [Validators.required]);
  documentation = new FormControl({}, [Validators.required]);

  constructor() { }

  ngDoCheck(): void {
    // If any value updates, update parent component
    if(this.tech.value || this.limitations.value || this.documentation.value) {
      this.conditionChange.emit({
        update: 'condition',
        value: {
          _id: this.condition._id,
          tech: this.tech.value,
          limitations: this.limitations.value,
          documentation: this.documentation.value
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
      if(this.tech.valid && this.limitations.valid && this.documentation.valid) {
        this.nextView.emit();
      }
    }

    prevStep() {
      this.prevView.emit();
    }

}
