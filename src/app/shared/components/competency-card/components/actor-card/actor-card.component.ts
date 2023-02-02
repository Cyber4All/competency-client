import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Actor } from '../../../../../../entity/actor';

@Component({
  selector: 'cc-actor-card',
  templateUrl: './actor-card.component.html',
  styleUrls: ['./actor-card.component.scss']
})
export class ActorCardComponent implements OnInit {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() actor!: Actor;
  @Output() actorChange = new EventEmitter<{update: string, value: Actor}>();
  @Output() actorUpdated = new EventEmitter<boolean>(false);
  currIndex: number | null = null;
  type = new FormControl('', [Validators.required]);
  details = new FormControl('', [Validators.required]);

  constructor(
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
  }

  // ngOnChanges(): void {
  //   // If any value updates, update parent component
  //   console.log("on changes?")
  //   if(this.type.value || this.details.value) {
  //     this.actorChange.emit({
  //       update: 'actor',
  //       value: {
  //         _id: this.actor._id,
  //         type: this.type.value,
  //         details: this.details.value
  //       }
  //     });
  //   };
  // }
}
