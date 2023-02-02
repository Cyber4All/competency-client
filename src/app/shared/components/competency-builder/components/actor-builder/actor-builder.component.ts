import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Actor } from '../../../../../../entity/actor';

@Component({
  selector: 'cc-actor-builder',
  templateUrl: './actor-builder.component.html',
  styleUrls: ['./actor-builder.component.scss']
})
export class ActorBuilderComponent implements OnInit {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() actor!: Actor;
  @Output() actorChange = new EventEmitter<{update: string, value: Actor}>();
  currIndex: number | null = null;
  type = new FormControl('', [Validators.required]);
  details = new FormControl('', [Validators.required]);

  constructor( ) {}

  async ngOnInit(): Promise<void> {
    this.type.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((typeUpdate: string) => {
        this.actorChange.emit({
          update: 'actor',
          value: {
            _id: this.actor._id,
            type: typeUpdate,
            details: this.details.value
          }
        });
      });
    this.details.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((detailsUpdate: string) => {
        this.actorChange.emit({
          update: 'actor',
          value: {
            _id: this.actor._id,
            type: this.type.value,
            details: detailsUpdate
          }
        });
      });
    // If value exists, set type form control
    if(this.actor.type) {
      this.type.patchValue(this.actor.type);
    }
    // If value exists, set details form control
    if(this.actor.details) {
      this.details.patchValue(this.actor.details);
    }
  }
}
