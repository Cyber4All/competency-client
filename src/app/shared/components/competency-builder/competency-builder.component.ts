import { Component, Input, OnInit, OnDestroy, HostListener, EventEmitter, Output } from '@angular/core';
import { Notes } from '../../../../entity/notes';
import { Actor } from '../../../../entity/actor';
import { Behavior } from '../../../../entity/Behavior';
import { BuilderError, BuilderValidation } from '../../../../entity/builder-validation';
import { Competency } from '../../../../entity/Competency';
import { Condition } from '../../../../entity/Condition';
import { Degree } from '../../../../entity/Degree';
import { Employability } from '../../../../entity/Employability';
import { BuilderService } from '../../../core/builder.service';
import { CompetencyBuilder, IndexButton } from '../../../../entity/builder.class';
import { SnackbarService } from '../../../core/snackbar.service';
import { SNACKBAR_COLOR } from '../snackbar/snackbar.component';
import { DropdownService } from '../../../core/dropdown.service';
import { DropdownType } from '../../../../entity/dropdown';
import { sleep } from '../../../core/competency.service';
import { LifecyclesService } from '../../../core/lifecycles.service';
@Component({
  selector: 'cc-competency-builder',
  templateUrl: './competency-builder.component.html',
  styleUrls: ['./competency-builder.component.scss']
})
export class CompetencyBuilderComponent implements OnInit, OnDestroy {
  @Input() competency!: CompetencyBuilder;
  @Output() close = new EventEmitter<boolean>();
  // Current Competency ID
  competencyId = '';
  // Index of current open builder component
  currIndex = 0;
  templateText = '';
  // Loading boolean
  loading = false;

  constructor(
    public builderService: BuilderService,
    private snackBarService: SnackbarService,
    private dropdownService: DropdownService,
    private lifecycleService: LifecyclesService,
    ) {}

  // Method to prevent user from leaving the page without saving competency data
  @HostListener('window:beforeunload', ['$event']) public OnBeforeUnload(event: any) {
    const confirmationMessage = '\o/';
    event.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    // Subscribe to the current index of the builder form component
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
      this.setTemplateButton();
    });
    // Set the current competency ID for inputs in child components
    this.competencyId = this.competency._id;
    this.setTemplateButton();
    // Set Actor Dropdowns
    await this.dropdownService.getDropdownItems(DropdownType.ACTOR);
    // Set Degree Dropdowns
    await this.dropdownService.getDropdownItems(DropdownType.TIME);
    await sleep(1000);
    this.loading = false;
  }

  /**
   * Method to toggle text of the template button
   */
  setTemplateButton() {
    switch(this.currIndex) {
      case 0:
        this.templateText = IndexButton.BEHAVIOR;
        break;
      case 1:
        this.templateText = IndexButton.CONTEXT;
        break;
      case 2:
        this.templateText = IndexButton.TECH;
        break;
      case 3:
        this.templateText = IndexButton.DOCUMENTATION;
        break;
      case 4:
        this.templateText = IndexButton.DEGREE;
        break;
      case 5:
        this.templateText = IndexButton.EMPLOYABILITY;
        break;
      case 6:
        this.templateText = IndexButton.EMPLOYABILITY;
        break;
      case 7:
        this.templateText = IndexButton.NOTES;
        break;
      case 8:
        this.templateText = IndexButton.REVIEW;
        break;
      default:
        this.templateText = IndexButton.BEHAVIOR;
        break;
    }
  }

  /**
   * Parent method to update attributes of a competency using the competency builder class
   * Each attribute of a competency is updated in the database to perserve draft competencies
   *
   * @param event is an event from the child componenet updating part of the competency
   * @update <string> is the competency attribute being updated
   * @value <Object> is the attribute type with updated fields
   */
  async updateCompetency(
    event: {
      update: string,
      value: Actor | Behavior | Condition | Degree | Employability | Notes
    }
  ): Promise<void> {
    try {
      switch(event.update) {
        case 'actor':
          this.competency = this.competency.setActor(event.value as Actor);
          const actorValid: BuilderValidation[] = this.competency.validateActor();
          if (actorValid.length === 1 && actorValid[0].isValid) {
            await this.builderService.updateActor(this.competency._id, this.competency.actor);
          }
          break;
        case 'behavior':
          this.competency = this.competency.setBehavior(event.value as Behavior);
          const behaviorValid: BuilderValidation[] = this.competency.validateBehavior();
          if (behaviorValid.length === 1 && behaviorValid[0].isValid) {
            await this.builderService.updateBehavior(this.competency._id, this.competency.behavior);
          }
          break;
        case 'condition':
          this.competency = this.competency.setCondition(event.value as Condition);
          const conditionValid: BuilderValidation[] = this.competency.validateCondition();
          if (conditionValid.length === 1 && conditionValid[0].isValid) {
            await this.builderService.updateCondition(this.competency._id, this.competency.condition);
          }
          break;
        case 'degree':
          this.competency = this.competency.setDegree(event.value as Degree);
          const degreeValid: BuilderValidation[] = this.competency.validateDegree();
          if (degreeValid.length === 1 && degreeValid[0].isValid) {
            await this.builderService.updateDegree(this.competency._id, this.competency.degree);
          }
          break;
        case 'employability':
          this.competency = this.competency.setEmployability(event.value as Employability);
          const employabilityValid: BuilderValidation[] = this.competency.validateEmployability();
          if (employabilityValid.length === 1 && employabilityValid[0].isValid) {
            await this.builderService.updateEmployability(this.competency._id, this.competency.employability);
          }
          break;
        case 'notes':
          this.competency = this.competency.setNotes(event.value as Notes);
          await this.builderService.updateNotes(this.competency._id, this.competency.notes);
          break;
        default:
          this.snackBarService.notification$.next({
            message: `Oops! Something's not right!`,
            title: 'Please notify us of this error at info@secured.team',
            color: SNACKBAR_COLOR.DANGER
          });
          break;
      }
    } catch (error: any) {
      if (error instanceof BuilderError) {
        this.builderService.setBuilderErrors(error as BuilderError);
        this.snackBarService.notification$.next({
          message: error.message,
          title: 'Competency Not Saved',
          color: SNACKBAR_COLOR.DANGER
        });
      } else {
        this.snackBarService.notification$.next({
          message: 'There was an error on our end. Please contact us at info@secured.team',
          title: 'Something Went Wrong!',
          color: SNACKBAR_COLOR.DANGER
        });
      }
    }
  }

  /**
   * Method to close competency builder
   */
  async closeBuilder(): Promise<void> {
    // Close the dialog and send a success notification
    this.close.emit(true);
    this.snackBarService.notification$.next({
      message: 'Draft Saved',
      title: 'Success',
      color: SNACKBAR_COLOR.SUCCESS
    });
  }

  deleteCompetency(): void {
    // Close the dialog
    this.close.emit(false);
  }

  /**
   * Method to submit a competency for publishing
   */
  async submitCompetency(): Promise<void> {
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
      // Update the status of a competnecy
      await this.lifecycleService.submitCompetency(competency._id);
      // Close the dialog and send a success notification
      this.close.emit(true);
      this.snackBarService.notification$.next({
        message: 'The competence in me honors the competence in you.',
        title: 'Namaste!',
        color: SNACKBAR_COLOR.SUCCESS
      });
    } catch (err: any) {
      // Check for builder errors,
      // then check for a message and send a notification, else send a generic error notification
      if (err instanceof BuilderError) {
        this.builderService.setBuilderErrors(err as BuilderError);
        this.snackBarService.notification$.next({
          message: err.message,
          title: 'Competency Not Submitted!',
          color: SNACKBAR_COLOR.DANGER
        });
      } else {
        this.snackBarService.notification$.next({
          message: 'There was an error on our end. Please contact us at info@secured.team',
          title: 'Something Went Wrong!',
          color: SNACKBAR_COLOR.DANGER
        });
      }
    }
  }

  /**
   * Method to destroy host listener on component tear down
   */
  ngOnDestroy(): void {
    this.builderService.setBuilderIndex(0);
    window.removeEventListener('beforeunload', this.ngOnDestroy.bind(this));
  }
}
