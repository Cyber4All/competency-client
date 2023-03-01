import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
export class CompetencyBuilderComponent implements OnInit, OnDestroy {
  @Input() competency!: CompetencyBuilder;
  // Toggle for editing a competency
  @Input() isEdit = true;
  // Current Competency ID
  competencyId = '';
  // Index of current open builder component
  currIndex = 0;
  // Index of current open builder component submenu template
  templateIndex = 0;

  constructor(
    public builderService: BuilderService,
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public COMPETENCY: CompetencyBuilder,
    private snackBarService: SnackbarService
  ) {}

  @HostListener('window:beforeunload', ['$event']) public OnBeforeUnload(event: any) {
    const confirmationMessage = '\o/';
    console.log('cond');
    event.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }

  ngOnInit(): void {
    // Subscribe to the current index of the builder form component
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });
    // Subscribe to the current index of the builder form component submenu template
    this.builderService.templateIndex.subscribe((index: number) => {
      this.templateIndex = index;
    });
    // If the competency is not passed in as input, set competency to injected dialog data
    if(!this.competency) {
      this.competency = this.COMPETENCY;
    }
    // Set the current competency ID for inputs in child components
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
        this.snackBarService.notification$.next({
          message: 'Yo you messed up dawg. Something went big wrong nahmean?',
          title: 'Competency Not Updated',
          color: SNACKBAR_COLOR.WARNING
        });
        break;
    }
  }

  /**
   * Method to store a competency
   */
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
      this.snackBarService.notification$.next({
        message: 'Competency Saved',
        title: 'success',
        color: SNACKBAR_COLOR.SUCCESS
      });
    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
        this.snackBarService.sendNotificationByError(err as HttpErrorResponse);
      } else if (err.message) {
        this.snackBarService.notification$.next({
          message: err.message,
          title: 'Competency Not Submitted',
          color: SNACKBAR_COLOR.DANGER
        });
      } else {
        this.snackBarService.notification$.next({
          message: 'Something went wrong, please try again later',
          title: 'Competency Not Submitted',
          color: SNACKBAR_COLOR.DANGER
        });
      }
    }
  }

  /**
   * Method to destroy host listener on component tear down
   */
  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.ngOnDestroy.bind(this));
  }
}
