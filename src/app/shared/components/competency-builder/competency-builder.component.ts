import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordionTogglePosition } from '@angular/material/expansion';
import { Notes } from 'src/entity/notes';
import { Actor } from '../../../../entity/actor';
import { Behavior } from '../../../../entity/behavior';
import { Competency } from '../../../../entity/competency';
import { Condition } from '../../../../entity/condition';
import { Degree } from '../../../../entity/degree';
import { Employability } from '../../../../entity/employability';
import { BuilderService } from '../../../core/builder/builder.service';
import { CompetencyBuilder } from '../../../core/builder/competency-builder.class';
@Component({
  selector: 'cc-competency-builder',
  templateUrl: './competency-builder.component.html',
  styleUrls: ['./competency-builder.component.scss']
})
export class CompetencyBuilderComponent implements OnInit {
  @Input() competency!: CompetencyBuilder;
  // Toggle for editing a competency
  @Input() isEdit = true;
  @Output() isSavable = new EventEmitter<boolean>(false);
  // Current Competency ID
  competencyId = '';
  // Index to toggle cards *** Null closes all cards
  compIndex: number | null = null;
  // Index of current open card component
  currIndex = 0;
  position: MatAccordionTogglePosition = 'before';

  /**
   * Boolean vars to track changes applied to a competency
   * These are used to ensure we can delete a competency shell if no fields are updated
   */
  actorUpdated = false;
  behaviorUpdated = false;
  conditionUpdated = false;
  degreeUpdated = false;
  employabilityUpdated = false;

  constructor(
    private builderService: BuilderService,
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public COMPETENCY: CompetencyBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.competency) {
      this.competency = this.COMPETENCY;
    }
    this.competencyId = this.competency._id;
  }

  /**
   * Opens selected builder view and closes last opened
   *
   * @param index location of selected builder element
   */
  setView(index: number | null): void {
    this.compIndex = index;
  }

  checkUpdateStatus(): void {
    if(
      this.actorUpdated
      && this.behaviorUpdated
      && this.conditionUpdated
      && this.degreeUpdated
      && this.employabilityUpdated
    ) {
      this.isSavable.emit(true);
    } else {
      this.isSavable.emit(false);
    }
  }

  /**
   * Parent method to update attributes of a competency
   *
   * @param event is an event from the child componenet updating part of the competency
   * @update <string> is the competency attribute being updated
   * @value <Object> is the attribute type with updated fields
   */
  updateCompetency(
    event: {
      update: string,
      value: Actor | Behavior | Condition | Degree | Employability | Notes
    }
  ): void {
    switch(event.update) {
      case 'actor':
        this.competency.setActor(event.value as Actor);
        break;
      case 'behavior':
        this.competency.setBehavior(event.value as Behavior);
        break;
      case 'condition':
        this.competency.setCondition(event.value as Condition);
        break;
      case 'degree':
        this.competency.setDegree(event.value as Degree);
        break;
      case 'employability':
        this.competency.setEmployability(event.value as Employability);
        break;
      case 'notes':
        this.competency.setNotes(event.value as Notes);
        break;
      default:
        console.log('yo you messed up dawg');
        break;
    }
    this.checkUpdateStatus();
  }

  async saveCompetency(): Promise<void> {
    try {
      const competency = this.competency.build();
      await this.builderService.updateActor(competency._id, competency.actor);
      await this.builderService.updateBehavior(competency._id, competency.behavior);
      await this.builderService.updateCondition(competency._id, competency.condition);
      await this.builderService.updateDegree(competency._id, competency.degree);
      await this.builderService.updateEmployability(competency._id, competency.employability);
      await this.builderService.updateNotes(competency._id, competency.notes);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject();
    }
  }
}
