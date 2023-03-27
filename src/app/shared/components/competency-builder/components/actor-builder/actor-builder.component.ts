import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Actor } from '../../../../../../entity/actor';
import { BuilderValidation } from '../../../../../../entity/builder-validation';
import { BuilderService } from '../../../../../core/builder/builder.service';

@Component({
  selector: 'cc-actor-builder',
  templateUrl: './actor-builder.component.html',
  styleUrls: ['./actor-builder.component.scss']
})
export class ActorBuilderComponent implements OnInit {

  @Input() actor!: Actor;
  @Output() actorChange = new EventEmitter<{update: string, value: Actor}>();
  actorErrors: BuilderValidation[] = [];
  type = new FormControl('');
  details = new FormControl('');

  constructor(
    private builderService: BuilderService,
  ) {}

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
    // Subscribe to type form control
    this.type.valueChanges
      .pipe(debounceTime(650))
      .subscribe((typeUpdate: string) => {
        // Remove type error from actorErrors array
        this.actorErrors = this.actorErrors.filter((error: BuilderValidation) => {
          return error.attribute !== 'type';
        });
        this.type.setErrors({error: false});
        // Emit actor type change to parent builder component
        this.actorChange.emit({
          update: 'actor',
          value: {
            _id: this.actor._id,
            type: typeUpdate,
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
        this.details.setErrors({error: false});
        // Emit actor details change to parent builder component
        this.actorChange.emit({
          update: 'actor',
          value: {
            _id: this.actor._id,
            type: this.actor.type,
            details: detailsUpdate
          }
        });
      });
    // If value passed, set type form control
    if(this.actor.type) {
      this.type.patchValue(this.actor.type);
    }
    // If value passed, set details form control
    if(this.actor.details) {
      this.details.patchValue(this.actor.details);
    }
  }

  displayErrors(): void {
    // Iterate through actorErrors array
    this.actorErrors.map((error: BuilderValidation) => {
      // If error is type, set type form control error
      if (error.attribute === 'type') {
        this.type.setErrors({error: true});
      }
      // If error is details, set details form control error
      if (error.attribute === 'details') {
        this.details.setErrors({error: true});
      }
    });
  }
}
