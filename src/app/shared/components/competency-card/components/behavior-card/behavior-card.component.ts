import { Component, Input, OnInit, DoCheck, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompetencyService } from 'src/app/core/competency.service';
import { Behavior } from 'src/entity/behavior';
@Component({
  selector: 'cc-behavior-card',
  templateUrl: './behavior-card.component.html',
  styleUrls: ['./behavior-card.component.scss']
})
export class BehaviorCardComponent implements OnInit, DoCheck {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() behavior!: Behavior;
  @Output() behaviorChange = new EventEmitter<{update: string, value: Behavior}>();
  @Output() setIndex = new EventEmitter<number>();
  currIndex: number | null = null;
  task = new FormControl('', [Validators.required]);
  details = new FormControl('', [Validators.required]);
  workrole = new FormControl({}, [Validators.required]);

  constructor(
    private competencyService: CompetencyService,
    // private subscription: Subscription
  ) {}

  ngOnInit(): void {
    this.competencyService.build.subscribe((index: number | null) => {
      if(index !== null) {
        this.currIndex = index;
      }
    });
    // If value exists, set type form control
    if(this.behavior.task) {
      this.task.patchValue(this.behavior.task);
    }
    // If value exists, set details form control
    if (this.behavior.details) {
      this.details.patchValue(this.behavior.details);
    }
    // If value exists, set workrole form control
    if (this.behavior.work_role) {
      this.workrole.patchValue(this.behavior.work_role);
    }
  }

  ngDoCheck(): void {
    // If any value updates, update parent component
    if(this.task.value || this.details.value || this.workrole.value) {
      this.behaviorChange.emit({
        update: 'behavior',
        value: {
          _id: this.behavior._id,
          task: this.task.value,
          details: this.details.value,
          work_role: this.workrole.value
        }
      });
    };
  }


  /**
   * Method to set view of builder element
   *
   * @param val value of current builder element
   */
  setStep(val: number) {
    this.setIndex.emit(val);
  }

  /**
   * Method to advance to next step
   */
  async nextStep() {
    if(this.task.valid && this.details.valid && this.workrole.valid) {
      const res: any = await this.competencyService.updateBehavior(
        this.competencyId,
        {
          _id: this.behavior._id,
          task: this.task.value,
          details: this.details.value,
          work_role: this.workrole.value
        }
      );
    }
  }
}
