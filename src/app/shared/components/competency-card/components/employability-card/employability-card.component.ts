import { Component, Input, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompetencyService } from 'src/app/core/competency.service';
import { Employability } from 'src/entity/employability';
@Component({
  selector: 'cc-employability-card',
  templateUrl: './employability-card.component.html',
  styleUrls: ['./employability-card.component.scss']
})
export class EmployabilityCardComponent implements OnInit, DoCheck {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() employability!: Employability;
  @Output() employabilityChange = new EventEmitter<{update: string, value: Employability}>();
  currIndex: number | null = null;
  details = new FormControl('', [Validators.required]);

  constructor(
    private competencyService: CompetencyService
  ) { }

  ngOnInit(): void {}

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
   * Method to advance to next step
   */
   async nextStep() {
    if(this.details.valid) {
      const res: any = await this.competencyService.updateEmployability(
        this.competencyId,
        {
          _id: this.employability._id,
          details: this.details.value
        }
      );
    }
  }
}
