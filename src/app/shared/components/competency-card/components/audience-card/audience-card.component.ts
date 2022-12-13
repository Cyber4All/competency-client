import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompetencyService } from '../../../../../../app/core/competency.service';
import { Audience } from '../../../../../../entity/Audience';

@Component({
  selector: 'cc-audience-card',
  templateUrl: './audience-card.component.html',
  styleUrls: ['./audience-card.component.scss']
})
export class AudienceCardComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() audience!: Audience;
  @Output() audienceChange = new EventEmitter<{update: string, value: Audience}>();
  currIndex: number | null = null;
  type = new FormControl('', [Validators.required]);
  details = new FormControl('', [Validators.required]);

  constructor(
    private competencyService: CompetencyService,
  ) {}

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

  ngOnChanges(): void {
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
   * Method to save audience and advance to next step
   */
   async updateAudience() {
    if(this.type.valid && this.details.valid) {
      await this.competencyService.updateAudience(
        this.competencyId,
        {
          type: this.type.value,
          details: this.details.value,
        }
      );
    }
  }
}
