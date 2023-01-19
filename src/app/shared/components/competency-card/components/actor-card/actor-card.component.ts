import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WorkroleService } from 'src/app/core/workrole.service';
import { CompetencyService } from '../../../../../core/competency.service';
import { Actor } from '../../../../../../entity/actor';

@Component({
  selector: 'cc-actor-card',
  templateUrl: './actor-card.component.html',
  styleUrls: ['./actor-card.component.scss']
})
export class ActorCardComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() actor!: Actor;
  @Output() actorChange = new EventEmitter<{update: string, value: Actor}>();
  @Output() actorUpdated = new EventEmitter<boolean>(false);
  currIndex: number | null = null;
  type = new FormControl('', [Validators.required]);
  details = new FormControl('', [Validators.required]);
  prereqs = [];

  constructor(
    private competencyService: CompetencyService,
    private workroleService: WorkroleService
  ) {}

  async ngOnInit(): Promise<void> {
    // If value exists, set type form control
    if(this.actor.type) {
      this.type.patchValue(this.actor.type);
    }
    // If value exists, set details form control
    if(this.actor.details) {
      this.details.patchValue(this.actor.details);
    }
    // Only retrieve skills and abilitiy suggestions if editing a competency
    if(this.isEdit) {
      await this.workroleService.getActorPrereqs()
        .then((prereqQuery: any) => {
          if (prereqQuery.data.prereqSuggestions) {
            this.prereqs = prereqQuery.data.prereqSuggestions;
          }
        });
    }
  }

  ngOnChanges(): void {
    // If any value updates, update parent component
    if(this.type.value || this.details.value) {
      this.actorChange.emit({
        update: 'actor',
        value: {
          _id: this.actor._id,
          type: this.type.value,
          details: this.details.value
        }
      });
    };
  }

  /**
   * Method to save actor and advance to next step
   */
   async updateActor() {
    if(this.type.valid && this.details.valid) {
      this.actorUpdated.emit(true);
      await this.competencyService.updateActor(
        this.competencyId,
        {
          type: this.type.value,
          details: this.details.value,
        }
      );
    }
  }
}
