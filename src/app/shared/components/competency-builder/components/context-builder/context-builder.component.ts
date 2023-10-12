import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Condition } from '../../../../entity/condition';
import { debounceTime } from 'rxjs';
import { Documentation } from '../../../../entity/documentation';
import { BuilderService } from '../../../../../core/builder.service';
import { BuilderValidation } from '../../../../entity/builder-validation';
interface DeleteFile {
  remove: boolean;
  id: string;
}
@Component({
  selector: 'cc-context-builder',
  templateUrl: './context-builder.component.html',
  styleUrls: ['./context-builder.component.scss']
})
export class ContextBuilderComponent implements OnInit {

  @Input() condition!: Condition;
  @Input() competencyId!: string;
  @Output() conditionChange = new EventEmitter<{ update: string, value: Condition }>();
  // Builder - Behavior validation errors
  contextErrors: BuilderValidation[] = [];
  currIndex!: number;
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

    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });

    // Subscribe to scenario form control
    this.scenario.valueChanges
      .pipe(debounceTime(650))
      .subscribe((scenarioUpdate: string) => {
        // Remove scenario error from contextErrors array
        this.contextErrors = this.contextErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'scenario';
        });
        this.scenario.setErrors({ error: false });
        // Emit context scenario change to parent builder component
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            scenario: scenarioUpdate,
            tech: this.condition.tech,
            limitations: this.condition.limitations,
            documentation: this.condition.documentation
          }
        });
      });
    // Subscribe to tech form control
    this.tech.valueChanges
      .pipe(debounceTime(650))
      .subscribe((techUpdate: string[]) => {
        // Remove tech error from contextErrors array
        this.contextErrors = this.contextErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'tech';
        });
        this.tech.setErrors({ error: false });
        // Emit context tech change to parent builder component
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            scenario: this.condition.scenario,
            tech: techUpdate,
            limitations: this.condition.limitations,
            documentation: this.condition.documentation
          }
        });
      });
    // Subscribe to limitations form control
    this.limitations.valueChanges
      .pipe(debounceTime(650))
      .subscribe((limitationsUpdate: string) => {
        // Remove limitations error from contextErrors array
        this.contextErrors = this.contextErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'limitations';
        });
        this.limitations.setErrors({ error: false });
        // Emit context limitations change to parent builder component
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            scenario: this.condition.scenario,
            tech: this.condition.tech,
            limitations: limitationsUpdate,
            documentation: [...this.condition.documentation]
          }
        });
      });
    // Subscribe to documentation form control
    this.documentation.valueChanges
      .pipe(debounceTime(650))
      .subscribe((documentationUpdate: Documentation | Documentation[] | DeleteFile) => {
        // If documentationUpdate is a DeleteFile object, remove the file from the documentation array
        if (documentationUpdate.hasOwnProperty('remove')) {
          // Find documentation object in array to remove
          const doc = this.condition.documentation.map((doc: Documentation) => {
            if (doc._id === (documentationUpdate as DeleteFile).id) {
              return doc;
            }
          });
          // Remove documentation object from array
          this.condition.documentation.splice(this.condition.documentation.indexOf(doc[0]), 1);
          // Emit file deletion to parent builder component
          this.conditionChange.emit({
            update: 'condition',
            value: {
              _id: this.condition._id,
              scenario: this.condition.scenario,
              tech: this.condition.tech,
              limitations: this.condition.limitations,
              documentation: [...this.condition.documentation]
            }
          });
        } else if ((documentationUpdate as Documentation[]).length > 0) {
          // Documentation already exists; emit file exists to parent builder component
          this.conditionChange.emit({
            update: 'condition',
            value: {
              _id: this.condition._id,
              scenario: this.condition.scenario,
              tech: this.condition.tech,
              limitations: this.condition.limitations,
              documentation: this.condition.documentation
            }
          });
        } else {
          // New file is being uploaded; add file to documentation array
          this.condition.documentation.push(documentationUpdate as Documentation);
          // Emit file upload to parent builder component
          this.conditionChange.emit({
            update: 'condition',
            value: {
              _id: this.condition._id,
              scenario: this.condition.scenario,
              tech: this.condition.tech,
              limitations: this.condition.limitations,
              documentation: [...this.condition.documentation]
            }
          });
        }
      });
    // If scenario exists, set scenario form control
    if (this.condition.scenario) {
      this.scenario.patchValue(this.condition.scenario);
    }
    // If value exists, set condition form control
    if (this.condition.tech) {
      this.technology = this.condition.tech;
      this.tech.patchValue(this.condition.tech);
    }
    // If value exists, set limitations form control
    if (this.condition.limitations) {
      this.limitations.patchValue(this.condition.limitations);
    }
    // If value exists, set documentation form control
    if (this.condition.documentation.length > 0) {
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
    if (index >= 0) {
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
        this.scenario.setErrors({ error: true });
      }
      // If error is for tech, set tech form control error
      if (contextError.attribute === 'tech') {
        this.tech.setErrors({ error: true });
      }
      // If error is for limitations, set limitations form control error
      if (contextError.attribute === 'limitations') {
        this.limitations.setErrors({ error: true });
      }
      // If error is for documentation, set documentation form control error
      if (contextError.attribute === 'documentation') {
        this.documentation.setErrors({ error: true });
      }
    });
  }
}
