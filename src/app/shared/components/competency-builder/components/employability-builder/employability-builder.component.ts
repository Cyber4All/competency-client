import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BuilderValidation } from '../../../../entity/builder-validation';
import { Employability } from '../../../../entity/employability';
import { BuilderService } from '../../../../../core/builder.service';
@Component({
  selector: 'cc-employability-builder',
  templateUrl: './employability-builder.component.html',
  styleUrls: ['./employability-builder.component.scss']
})
export class EmployabilityBuilderComponent implements OnInit {

  @Input() employability!: Employability;
  @Output() employabilityChange = new EventEmitter<{ update: string, value: Employability }>();
  employabilityErrors: BuilderValidation[] = [];
  details = new FormControl('');

  constructor(
    private builderService: BuilderService,
  ) { }

  ngOnInit(): void {
    // Subscribe to employability errors
    this.builderService.employabilityErrors.subscribe((errors: BuilderValidation[]) => {
      // Iterate through errors
      errors.map((error: BuilderValidation) => {
        // If error is not already in local employabilityErrors array, add it
        if (this.employabilityErrors.findIndex((employabilityError: BuilderValidation) => {
          return employabilityError.attribute === error.attribute;
        }) === -1) {
          this.employabilityErrors.push(error);
        }
        // Set form validation errors
        this.displayErrors();
      });
    });
    // Subscribe to details form control
    this.details.valueChanges
      .pipe(debounceTime(650))
      .subscribe((detailsChange: string) => {
        // Remove details error from employabilityErrors array
        this.employabilityErrors = this.employabilityErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'details';
        });
        this.details.setErrors({ error: false });
        // Emit employability details change to parent builder component
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

  displayErrors(): void {
    // Iterate through employability errors
    this.employabilityErrors.map((error: BuilderValidation) => {
      // If error is for details, set details form control error
      if (error.attribute === 'details') {
        this.details.setErrors({ error: true });
      }
    });
  }
}
