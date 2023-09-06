import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Actor } from '../../../../entity/actor';
import { BuilderValidation } from '../../../../entity/builder-validation';
import { DropdownItem, DropdownType } from '../../../../entity/dropdown';
import { BuilderService } from '../../../../../core/builder.service';
import { DropdownService } from '../../../../../core/dropdown.service';

@Component({
  selector: 'cc-actor-builder',
  templateUrl: './actor-builder.component.html',
  styleUrls: ['./actor-builder.component.scss']
})
export class ActorBuilderComponent implements OnInit {

  @Input() actor!: Actor;
  @Output() actorChange = new EventEmitter<{ update: string, value: Actor }>();
  actorErrors: BuilderValidation[] = [];
  type = new FormControl('');
  details = new FormControl('');
  actorList!: DropdownItem[];
  actorDisplay = false;
  actorSelected!: DropdownItem;

  constructor(
    private builderService: BuilderService,
    private dropdownService: DropdownService
  ) { }

  async ngOnInit(): Promise<void> {
    // Subscribe to actor errors
    this.builderService.actorErrors.subscribe((errors: BuilderValidation[]) => {
      // Iterate through errors
      errors.map((error: BuilderValidation) => {
        // If error is not already in local actorErrors array, add it
        if (this.actorErrors.findIndex((actorError: BuilderValidation) => {
          return actorError.attribute === error.attribute;
        }) === -1) {
          this.actorErrors.push(error);
        }
        // Set form validation errors
        this.displayErrors();
      });
    });
    // Subscribe to actor dropdown list
    this.dropdownService.actorList.subscribe((actorList: DropdownItem[]) => {
      this.actorList = actorList;
    });
    // Subscribe to type form control
    this.type.valueChanges
      .pipe(debounceTime(650))
      .subscribe(() => {
        // Remove type error from actorErrors array
        this.actorErrors = this.actorErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'type';
        });
        this.type.setErrors({ error: false });
        // Emit actor type change to parent builder component
        this.actorChange.emit({
          update: 'actor',
          value: {
            _id: this.actor._id,
            type: this.actorSelected._id,
            details: this.actor.details
          }
        });
      });
    // Subscribe to details form control
    this.details.valueChanges
      .pipe(debounceTime(650))
      .subscribe((detailsUpdate: string) => {
        // Remove details error from actorErrors array
        this.actorErrors = this.actorErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'details';
        });
        this.details.setErrors({ error: false });
        // Emit actor details change to parent builder component
        this.actorChange.emit({
          update: 'actor',
          value: {
            _id: this.actor._id,
            type: this.actorSelected._id,
            details: detailsUpdate
          }
        });
      });
    // If value passed, set type form control
    if (this.actor.type) {
      // Filter actor list to find selected actor
      this.actorSelected = this.actorList.filter((actor: DropdownItem) => {
        if (actor._id === this.actor.type) {
          // If building new competency, dropdown item _id is type
          return actor;
        } else {
          // If editing competency, dropdown item value is type
          return actor.value === this.actor.type;
        }
      })[0];
      this.type.patchValue(true);
    }
    // If value passed, set details form control
    if (this.actor.details) {
      this.details.patchValue(this.actor.details);
    }
  }

  displayActors() {
    if (this.actorDisplay === true) {
      this.actorDisplay = false;
    } else {
      this.actorDisplay = true;
    }
  }

  displayErrors(): void {
    // Iterate through actorErrors array
    this.actorErrors.map((error: BuilderValidation) => {
      // If error is type, set type form control error
      if (error.attribute === 'type') {
        this.type.setErrors({ error: true });
      }
      // If error is details, set details form control error
      if (error.attribute === 'details') {
        this.details.setErrors({ error: true });
      }
    });
  }
}
