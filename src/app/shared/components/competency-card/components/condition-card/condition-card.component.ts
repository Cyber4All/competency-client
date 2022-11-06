import { Component, Input, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompetencyService } from 'src/app/core/competency.service';
import { Condition } from 'src/entity/condition';
@Component({
  selector: 'cc-condition-card',
  templateUrl: './condition-card.component.html',
  styleUrls: ['./condition-card.component.scss']
})
export class ConditionCardComponent implements OnInit, DoCheck {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() condition!: Condition;
  @Output() conditionChange = new EventEmitter<{update: string, value: Condition}>();
  currIndex: number | null = null;
  tech = new FormControl([], [Validators.required]);
  limitations = new FormControl('', [Validators.required]);
  documentation = new FormControl([], [Validators.required]);

  constructor(
    private competencyService: CompetencyService
  ) { }

  ngOnInit(): void {
    // If value exists, set type form control
    if(this.condition.tech) {
      this.tech.patchValue(this.condition.tech);
    }
    // If value exists, set details form control
    if (this.condition.limitations) {
      this.limitations.patchValue(this.condition.limitations);
    }
    // If value exists, set workrole form control
    if (this.condition.documentation) {
      this.documentation.patchValue(this.condition.documentation);
    }
  }

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
   * Method to advance to next step
   */
   async nextStep() {
    if(this.tech.valid && this.limitations.valid && this.documentation.valid) {
      const res: any = await this.competencyService.updateCondition(
        this.competencyId,
        {
          _id: this.condition._id,
          tech: this.tech.value,
          limitations: this.limitations.value,
          documentation: this.documentation.value
        }
      );
    }
  }
}
