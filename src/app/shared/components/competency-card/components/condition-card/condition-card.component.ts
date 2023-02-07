import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { CompetencyService } from '../../../../../../app/core/competency.service';
import { Condition } from '../../../../../../entity/condition';
import { MatChipInputEvent } from '@angular/material/chips';
import { FileService } from 'src/app/core/file.service';
import { Documentation } from 'src/entity/documentation';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
@Component({
  selector: 'cc-condition-card',
  templateUrl: './condition-card.component.html',
  styleUrls: ['./condition-card.component.scss']
})
export class ConditionCardComponent implements OnInit, OnChanges {

  /**
   * THIS IS STILL BEING WORKED ON
   * DOCUMENTATION IS BROKEN ATM (11/11/22)
   */

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() condition!: Condition;
  @Output() conditionChange = new EventEmitter<{update: string, value: Condition}>();
  @Output() conditionUpdated = new EventEmitter<boolean>(false);
  tech = new FormControl([], [Validators.required]);
  limitations = new FormControl('', [Validators.required]);
  documentation = new FormControl('', [Validators.required]);
  technology: string[] = [];
  deletingMany: Documentation[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA, TAB] as const;

  constructor(
    private competencyService: CompetencyService,
    private fileService: FileService
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

  ngOnChanges(): void {
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

  /**
   * Method to save condition updates
   */
   async updateCondition() {
    if(this.tech.valid && this.limitations.valid && this.documentation.valid) {
      this.conditionUpdated.emit(true);
      await this.competencyService.updateCondition(
        this.competencyId,
        {
          _id: this.condition._id,
          tech: this.tech.value,
          limitations: this.limitations.value,
          documentation: [this.documentation.value]
        }
      );
    }
  }

  /**
   * Method to delete a file and the associated documentation
   *
   * @param documentation The documentation(s) to be deleted
   */
  async handleFileDelete(documentation: Documentation | Documentation[]) {
    await this.fileService.deleteFile(this.competencyId, documentation);
  }

  /**
   * Method to track what documentations will be deleted when "Delete Many" is clicked
   *
   * @param documentation the documentation to be added or deleted for deleting multiple files
   * @param event whether or not the documentation is to be added or removed
   */
  async changeMultipleDelete(documentation: Documentation, event: any) {
    event.target.checked ? this.deletingMany.push(documentation) : this.deletingMany.splice(this.deletingMany.indexOf(documentation), 1);
  }
}
