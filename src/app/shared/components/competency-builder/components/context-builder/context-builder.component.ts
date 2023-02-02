import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Condition } from '../../../../../../entity/condition';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { debounceTime } from 'rxjs';
import { Documentation } from '../../../../../../entity/documentation';
@Component({
  selector: 'cc-context-builder',
  templateUrl: './context-builder.component.html',
  styleUrls: ['./context-builder.component.scss']
})
export class ContextBuilderComponent implements OnInit {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() condition!: Condition;
  @Output() conditionChange = new EventEmitter<{update: string, value: Condition}>();
  @Output() conditionUpdated = new EventEmitter<boolean>(false);
  tech = new FormControl([], [Validators.required]);
  limitations = new FormControl('', [Validators.required]);
  documentation = new FormControl([], [Validators.required]);
  technology: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA, TAB] as const;

  constructor() { }

  ngOnInit(): void {
    this.tech.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((techUpdate: string[]) => {
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            tech: techUpdate,
            limitations: this.limitations.value,
            documentation: this.documentation.value
          }
        });
      });
    this.limitations.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((limitationsUpdate: string) => {
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            tech: this.tech.value,
            limitations: limitationsUpdate,
            documentation: this.documentation.value
          }
        });
      });
    this.documentation.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((documentationUpdate: Documentation[]) => {
        this.conditionChange.emit({
          update: 'condition',
          value: {
            _id: this.condition._id,
            tech: this.tech.value,
            limitations: this.limitations.value,
            documentation: documentationUpdate
          }
        });
      });
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

  /**
   * Method to add a technology string
   *
   * @param event input event for creating a chip component
   */
  addTechnology(event: MatChipInputEvent) {
    // Get value
    const value = (event.value || '').trim();
    // Only update if value exists
    if(value) {
      this.technology.push(value);
      // Patch form control with new technology array
      this.tech.patchValue(this.technology);
    }
    // Clear input
    event.chipInput!.clear();
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
}
