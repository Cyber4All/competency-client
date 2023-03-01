import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Employability } from '../../../../../../entity/employability';
@Component({
  selector: 'cc-employability-builder',
  templateUrl: './employability-builder.component.html',
  styleUrls: ['./employability-builder.component.scss']
})
export class EmployabilityBuilderComponent implements OnInit {

  @Input() employability!: Employability;
  @Output() employabilityChange = new EventEmitter<{update: string, value: Employability}>();
  details = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
    this.details.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((detailsChange: string) => {
        this.employabilityChange.emit({
          update: 'employability',
          value: {
            _id: this.employability._id,
            details: detailsChange
          }
        });
      });
    // If value exists, set details form control
    if (this.employability.details) {
      this.details.patchValue(this.employability.details);
    }
  }
}
