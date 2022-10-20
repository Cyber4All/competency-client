import { Component, Input, OnInit, DoCheck, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Audience } from 'src/entity/Audience';

@Component({
  selector: 'cc-audience-card',
  templateUrl: './audience-card.component.html',
  styleUrls: ['./audience-card.component.scss']
})
export class AudienceCardComponent implements OnInit, DoCheck {

  @Input() isEdit = false;
  @Input() currIndex: number | null = null;
  @Input() audience!: Audience;
  @Output() audienceChange = new EventEmitter<{update: string, value: Audience}>();
  @Output() setIndex = new EventEmitter<number>();
  @Output() nextView = new EventEmitter();
  type = new FormControl('', [Validators.required]);
  details = new FormControl('', [Validators.required]);

  constructor() {}

  ngOnInit(): void {
    // If value exists, set type form control
    if(this.audience.type) {
      this.type.patchValue(this.audience.type);
    }
    // If value exists, set details form control
    if (this.audience.details) {
      this.details.patchValue(this.audience.details);
    }
  }

  ngDoCheck(): void {
    // If any value updates, update parent component
    if(this.type.value || this.details.value) {
      this.audienceChange.emit({
        update: 'audience',
        value: {
          _id: this.audience._id,
          type: this.type.value,
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
    if(this.type.valid && this.details.valid) {
      this.nextView.emit();
    }
  }
}
