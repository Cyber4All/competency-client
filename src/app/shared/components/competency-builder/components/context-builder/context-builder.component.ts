import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Condition } from '../../../../../../entity/condition';
import { debounceTime } from 'rxjs';
import { Documentation } from '../../../../../../entity/documentation';
import { BuilderService } from '../../../../../core/builder/builder.service';
import { BuilderValidation } from '../../../../../../entity/builder-validation';
@Component({
  selector: 'cc-context-builder',
  templateUrl: './context-builder.component.html',
  styleUrls: ['./context-builder.component.scss']
})
export class ContextBuilderComponent implements OnInit {

  @Input() condition!: Condition;
  @Output() conditionChange = new EventEmitter<{update: string, value: Condition}>();
  // Builder - Behavior validation errors
  contextErrors: BuilderValidation[] = [];
  templateIndex = 0;
  // Form controls
  scenario = new FormControl('');
  tech = new FormControl([]);
  limitations = new FormControl('');
  documentation = new FormControl([]);
  // Temp variables for technology form control
  technology: string[] = [];
  techInput = '';
  constructor(
    public builderService: BuilderService
  ) { }

  ngOnInit(): void {
    // Subscribe to context errors
    this.builderService.contextErrors.subscribe((errors: BuilderValidation[]) => {
      // Iterate through errors
      errors.map((error: BuilderValidation) => {
        // If error is not already in local contextErrors array, add it
        if (this.contextErrors.findIndex((contextError: BuilderValidation) => {
          return contextError.attribute === error.attribute;
        }) === -1) {
          this.contextErrors.push(error);
        }
        // Set form validation errors
        this.displayErrors();
      });
    });
    // Subscribe to template index
    this.builderService.templateIndex.subscribe((index: number) => {
      this.templateIndex = index;
    });
    // Subscribe to scenario form control
    this.scenario.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((scenarioUpdate: string) => {
        // Remove scenario error from contextErrors array
        this.contextErrors = this.contextErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'scenario';
        });
        this.scenario.setErrors({error: false});
        // Emit context scenario change to parent builder component
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            scenario: scenarioUpdate,
            tech: this.tech.value,
            limitations: this.limitations.value,
            documentation: this.documentation.value
          }
        });
      });
    // Subscribe to tech form control
    this.tech.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((techUpdate: string[]) => {
        // Remove tech error from contextErrors array
        this.contextErrors = this.contextErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'tech';
        });
        this.tech.setErrors({error: false});
        // Emit context tech change to parent builder component
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            scenario: this.scenario.value,
            tech: techUpdate,
            limitations: this.limitations.value,
            documentation: this.documentation.value
          }
        });
      });
    // Subscribe to limitations form control
    this.limitations.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((limitationsUpdate: string) => {
        // Remove limitations error from contextErrors array
        this.contextErrors = this.contextErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'limitations';
        });
        this.limitations.setErrors({error: false});
        // Emit context limitations change to parent builder component
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            scenario: this.scenario.value,
            tech: this.tech.value,
            limitations: limitationsUpdate,
            documentation: this.documentation.value
          }
        });
      });
    // Subscribe to documentation form control
    this.documentation.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((documentationUpdate: Documentation[]) => {
        // Remove documentation error from contextErrors array
        this.contextErrors = this.contextErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'documentation';
        });
        this.documentation.setErrors({error: false});
        // Emit context documentation change to parent builder component
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            scenario: this.scenario.value,
            tech: this.tech.value,
            limitations: this.limitations.value,
            documentation: documentationUpdate
          }
        });
      });
    // If scenario exists, set scenario form control
    if (this.condition.scenario) {
      this.scenario.patchValue(this.condition.scenario);
    }
    // If value exists, set type form control
    if(this.condition.tech) {
      this.technology = this.condition.tech;
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

  /**
   * Method to add a new technology string
   *
   * @param event input event for creating a chip component
   */
  addTechnology(event: KeyboardEvent) {
    // Check for Enter and Tab keyboard events
    if (event.key === 'Enter' || event.key === 'Tab') {
      // Prevent default event
      event.preventDefault();
      // Get current value of input field
      const value = this.techInput.trim();
      if (value) {
        // Add value to technology array
        this.technology.push(value);
        // Patch form control with new technology array
        this.tech.patchValue(this.technology);
        // Clear input field
        this.techInput = '';
      }
    }
  }

  /**
   * Method to remove technology from form
   *
   * @param tech technology to be removed
   */
  removeTechnology(tech: string) {
    // Find index of technology
    const index = this.technology.indexOf(tech);
    if(index >= 0) {
      // Remove tech from technology array
      this.technology.splice(index, 1);
      // Update form control with new technology array
      this.tech.patchValue(this.technology);
    }
  }

  displayErrors(): void {
    // Iterate through contextErrors array
    this.contextErrors.map((contextError: BuilderValidation) => {
      // If error is for scenario, set scenario form control error
      if (contextError.attribute === 'scenario') {
        this.scenario.setErrors({error: true});
      }
      // If error is for tech, set tech form control error
      if (contextError.attribute === 'tech') {
        this.tech.setErrors({error: true});
      }
      // If error is for limitations, set limitations form control error
      if (contextError.attribute === 'limitations') {
        this.limitations.setErrors({error: true});
      }
      // If error is for documentation, set documentation form control error
      if (contextError.attribute === 'documentation') {
        this.documentation.setErrors({error: true});
      }
    });
  }
}
