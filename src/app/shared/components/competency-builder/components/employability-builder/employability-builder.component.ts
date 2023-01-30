import { Component, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompetencyService } from '../../../../../../app/core/competency.service';
import { Employability } from '../../../../../../entity/employability';
@Component({
  selector: 'cc-employability-builder',
  templateUrl: './employability-builder.component.html',
  styleUrls: ['./employability-builder.component.scss']
})
export class EmployabilityBuilderComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() employability!: Employability;
  @Output() employabilityChange = new EventEmitter<{update: string, value: Employability}>();
  @Output() employabilityUpdated = new EventEmitter<boolean>(false);
  currIndex: number | null = null;
  details = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
    // If value exists, set details form control
    if (this.employability.details) {
      this.details.patchValue(this.employability.details);
    }
  }

  ngOnChanges(): void {
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
}
