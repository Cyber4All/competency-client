import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notes } from 'src/entity/notes';
import { Actor } from '../../../../entity/actor';
import { Behavior } from '../../../../entity/behavior';
import { BuilderError } from '../../../../entity/builder-validation';
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
  // Current Competency ID
  competencyId = '';
  // Index of current open builder component
  currIndex = 0;
  // Index of current open builder component's submenu
  templateIndex = 0;

  constructor(
    public builderService: BuilderService,
    public dialogRef: MatDialogRef<CompetencyBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) private COMPETENCY: CompetencyBuilder,
    private snackBarService: SnackbarService
  ) {}

  // Method to prevent user from leaving the page without saving competency data
  @HostListener('window:beforeunload', ['$event']) public OnBeforeUnload(event: any) {
    const confirmationMessage = '\o/';
    event.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }

  ngOnInit(): void {
    // Subscribe to the current index of the builder form component
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });
    // Subscribe to the current index of the builder form component's submenu
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
   * Parent method to update attributes of a competency using the competency builder class
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
          color: SNACKBAR_COLOR.DANGER
        });
        break;
    }
  }

  /**
   * Method to save all competency data to the database
   */
  async saveCompetency(): Promise<void> {
    try {
      // Build the competency builder class object into a competency entity
      const competency: Competency = this.competency.build();
      // Update the competency in the database
      await this.builderService.updateActor(competency._id, competency.actor);
      await this.builderService.updateBehavior(competency._id, competency.behavior);
      await this.builderService.updateCondition(competency._id, competency.condition);
      await this.builderService.updateDegree(competency._id, competency.degree);
      await this.builderService.updateEmployability(competency._id, competency.employability);
      await this.builderService.updateNotes(competency._id, competency.notes);
      // Close the dialog and send a success notification
      this.dialogRef.close(true);
      this.snackBarService.notification$.next({
        message: 'Competency Saved',
        title: 'success',
        color: SNACKBAR_COLOR.SUCCESS
      });
    } catch (err: any) {
      // Check for HttpErrorResponse first, check for builder errors,
      // then check for a message and send a notification, else send a generic error notification
      if (err instanceof HttpErrorResponse) {
        // I don't think this works when multiple errors are returned from the api
        this.snackBarService.sendNotificationByError(err as HttpErrorResponse);
      } else if (err instanceof BuilderError) {
        this.builderService.setBuilderErrors(err as BuilderError);
        this.snackBarService.notification$.next({
          message: err.message,
          title: 'Competency Not Submitted',
          color: SNACKBAR_COLOR.DANGER
        });
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
