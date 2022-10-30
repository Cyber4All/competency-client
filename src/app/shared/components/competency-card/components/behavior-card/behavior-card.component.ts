import { Component, Input, OnInit, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Behavior } from 'src/entity/behavior';
@Component({
  selector: 'cc-behavior-card',
  templateUrl: './behavior-card.component.html',
  styleUrls: ['./behavior-card.component.scss']
})
export class BehaviorCardComponent implements OnInit, DoCheck {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() currIndex: number | null = null;
  @Input() behavior!: Behavior;
  @Output() behaviorChange = new EventEmitter<{update: string, value: Behavior}>();
  @Output() setIndex = new EventEmitter<number>();
  @Output() nextView = new EventEmitter();
  @Output() prevView = new EventEmitter();
  task = new FormControl('', [Validators.required]);
  details = new FormControl('', [Validators.required]);
  workrole = new FormControl({}, [Validators.required]);

  constructor() {}

  ngOnInit(): void {
    // If value exists, set type form control
    if(this.behavior.task) {
      this.task.patchValue(this.behavior.task);
    }
    // If value exists, set details form control
    if (this.behavior.details) {
      this.details.patchValue(this.behavior.details);
    }
    // If value exists, set workrole form control
    if (this.behavior.workrole) {
      this.workrole.patchValue(this.behavior.workrole);
    }
  }

  ngDoCheck(): void {
    // If any value updates, update parent component
    if(this.task.value || this.details.value || this.workrole.value) {
      this.behaviorChange.emit({
        update: 'behavior',
        value: {
          _id: this.behavior._id,
          task: this.task.value,
          details: this.details.value,
          workrole: this.workrole.value
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
    if(this.task.valid && this.details.valid && this.workrole.valid) {
      this.nextView.emit();
    }
  }

  prevStep() {
    this.prevView.emit();
  }
}
