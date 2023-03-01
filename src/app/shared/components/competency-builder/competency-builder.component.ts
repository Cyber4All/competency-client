import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { SnackbarService } from '../../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../snackbar/snackbar.component';
@Component({
  selector: 'cc-competency-builder',
  templateUrl: './competency-builder.component.html',
  styleUrls: ['./competency-builder.component.scss']
})
export class CompetencyBuilderComponent implements OnInit {
  @Input() competency!: CompetencyBuilder;
  // Toggle for editing a competency
  @Input() isEdit = true;
  // Current Competency ID
  competencyId = '';
  // Index of current open card component
  currIndex = 0;
  templateIndex = 0;
  position: MatAccordionTogglePosition = 'before';

  constructor(
    public builderService: BuilderService,
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public COMPETENCY: CompetencyBuilder,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });
    this.builderService.templateIndex.subscribe((index: number) => {
      this.templateIndex = index;
    });
    if(!this.competency) {
      this.competency = this.COMPETENCY;
    }
    this.competencyId = this.competency._id;
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
  }

  async saveCompetency(): Promise<void> {
    try {
      const competency: Competency = this.competency.build();
      await this.builderService.updateActor(competency._id, competency.actor);
      await this.builderService.updateBehavior(competency._id, competency.behavior);
      await this.builderService.updateCondition(competency._id, competency.condition);
      await this.builderService.updateDegree(competency._id, competency.degree);
      await this.builderService.updateEmployability(competency._id, competency.employability);
      await this.builderService.updateNotes(competency._id, competency.notes);
      this.dialogRef.close(true);
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      if (err instanceof HttpErrorResponse) {
        this.snackBarService.sendNotificationByError(err as HttpErrorResponse);
      } else {
        this.snackBarService.notification$.next({
          message: 'Something went wrong. Please try again.',
          title: 'error',
          color: SNACKBAR_COLOR.WARNING
        });
      }
      return Promise.reject();
    }
  }
}
