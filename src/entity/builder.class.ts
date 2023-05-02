import { Actor } from './actor';
import { Behavior } from './Behavior';
import { Competency } from './Competency';
import { Condition } from './Condition';
import { Degree } from './Degree';
import { Documentation } from './Documentation';
import { Employability } from './Employability';
import { Lifecycles } from './Lifecycles';
import { Notes } from './notes';
import { BuilderError, BuilderValidation } from './builder-validation';

export enum IndexButton {
    BEHAVIOR = 'CONTINUE TO BEHAVIOR',
    CONTEXT = 'CONTINUE TO CONTEXT',
    TECH = 'CONTINUE TO TECHNOLOGY',
    DOCUMENTATION = 'CONTINUE TO DOCUMENTATION',
    DEGREE = 'CONTINUE TO DEGREE',
    RUBRIC = 'CONTINUE TO RUBRIC',
    EMPLOYABILITY = 'CONTINUE TO EMPLOYABILITY',
    NOTES = 'CONTINUE TO NOTES',
    REVIEW = 'CONTINUE TO REVIEW',
    SUBMIT = 'SUBMIT COMPETENCY'
}


export class CompetencyBuilder extends Competency {
    _id!: string;
    status!: Lifecycles;
    authorId!: string;
    version!: number;
    actor!: Actor;
    behavior!: Behavior;
    condition!: Condition;
    degree!: Degree;
    employability!: Employability;
    notes!: Notes;

    constructor(
        _id: string,
        status: Lifecycles,
        authorId: string,
        version: number,
        actor: Actor,
        behavior: Behavior,
        condition: Condition,
        degree: Degree,
        employability: Employability,
        notes: Notes
    ) {
        super(
            _id,
            status,
            authorId,
            version,
            actor,
            behavior,
            condition,
            degree,
            employability,
            notes
        );

        this._id = _id;
        this.status = status;
        this.authorId = authorId;
        this.version = version;
        this.actor = actor;
        this.behavior = behavior;
        this.condition = condition;
        this.degree = degree;
        this.employability = employability;
        this.notes = notes;
    }

    setActor(update: {details: string, type: string}) {
        this.actor = update;
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    setBehavior(update: {tasks: string[], work_role: string, details: string}) {
        this.behavior = update;
        return this;
    }

    setCondition(update: {scenario: string, limitations: string, tech: string[], documentation: Documentation[]}) {
        this.condition = update;
        return this;
    }

    setDegree(update: {time: string, correct: string, complete: string}) {
        this.degree = update;
        return this;
    }

    setEmployability(update: {details: string}) {
        this.employability = update;
        return this;
    }

    setNotes(update: {details: string}) {
        this.notes = update;
        return this;
    }

    /**
     * Method to build a competency object
     *
     * @throws BuilderValidation errors if any required fields are missing.
     * @returns Competency
     */
    build() {
        // Validate all required fields are present
        const builderValidation: BuilderValidation[] = [
            ...this.validateActor(),
            ...this.validateBehavior(),
            ...this.validateCondition(),
            ...this.validateDegree(),
            ...this.validateEmployability()
        ];
        // Filter out invalid fields
        const builderErrors = builderValidation.filter((validation: BuilderValidation) => !validation.isValid);
        // If any invalid fields are found, throw an error and return invalid fields to builder
        if (builderErrors.length > 0) {
            throw new BuilderError('builder', 'builder', false, 'Please ensure all required fields are complete.', builderErrors);
        }
        return new Competency(
            this._id,
            this.status,
            this.authorId,
            this.version,
            this.actor,
            this.behavior,
            this.condition,
            this.degree,
            this.employability,
            this.notes
        );
    }

    /**
     * Validates all required attributes of the actor object
     *
     * @returns <BuilderValidation>[] - Array of validation objects
     */
    validateActor(): BuilderValidation[] {
        const actorErrors: BuilderValidation[] = [];
        if (!this.actor.details || !this.actor.type) {
            if (!this.actor.details) {
                actorErrors.push({
                    type: 'actor',
                    attribute: 'details',
                    isValid: false,
                    message: 'Actor details are required.'
                });
            }
            if (!this.actor.type) {
                actorErrors.push({
                    type: 'actor',
                    attribute: 'type',
                    isValid: false,
                    message: 'An actor type is required.'
                });
            }
        } else {
            actorErrors.push({
                type: 'actor',
                isValid: true
            });
        }
        return actorErrors;
    }

    /**
     * Validates all required attributes of the behavior object
     *
     * @returns <BuilderValidation>[] - Array of validation objects
     */
    validateBehavior(): BuilderValidation[] {
        const behaviorErrors: BuilderValidation[] = [];
        if (!this.behavior.details || !this.behavior.work_role || !this.behavior.tasks) {
            if (!this.behavior.details) {
                behaviorErrors.push({
                    type: 'behavior',
                    attribute: 'details',
                    isValid: false,
                    message: 'Behavior details are required.'
                });
            }
            if (!this.behavior.work_role) {
                behaviorErrors.push({
                    type: 'behavior',
                    attribute: 'work_role',
                    isValid: false,
                    message: 'A work-role is required.'
                });
            }
            if (!this.behavior.tasks) {
                behaviorErrors.push({
                    type: 'behavior',
                    attribute: 'tasks',
                    isValid: false,
                    message: 'At least one task is required.'
                });
            }
        } else {
            behaviorErrors.push({
                type: 'behavior',
                isValid: true
            });
        }
        return behaviorErrors;
    }

    /**
     * Validates all required attributes of the condition object
     *
     * @returns <BuilderValidation>[] - Array of validation objects
     */
    validateCondition(): BuilderValidation[] {
        const conditionErrors: BuilderValidation[] = [];
        if (!this.condition.scenario || !this.condition.limitations || !this.condition.tech || !this.condition.documentation) {
            if (!this.condition.scenario) {
                conditionErrors.push({
                    type: 'condition',
                    attribute: 'scenario',
                    isValid: false,
                    message: 'Scenario is required.'
                });
            }
            if (!this.condition.limitations) {
                conditionErrors.push({
                    type: 'condition',
                    attribute: 'limitations',
                    isValid: false,
                    message: 'Limitations are required.'
                });
            }
            if (this.condition.tech.length === 0) {
                conditionErrors.push({
                    type: 'condition',
                    attribute: 'tech',
                    isValid: false,
                    message: 'At least one technology is required.'
                });
            }
        } else {
            conditionErrors.push({
                type: 'condition',
                isValid: true
            });
        }
        return conditionErrors;
    }

    /**
     * Validates all required attributes of the degree object
     *
     * @returns <BuilderValidation>[] - Array of validation objects
     */
    validateDegree(): BuilderValidation[] {
        const degreeErrors: BuilderValidation[] = [];
        if (!this.degree.time || !this.degree.correct || !this.degree.complete) {
            if (!this.degree.time) {
                degreeErrors.push({
                    type: 'degree',
                    attribute: 'time',
                    isValid: false,
                    message: 'Time is required.'
                });
            }
            // Check that time is a number
            if (this.degree.time.split(' - ') && isNaN(Number(this.degree.time.split(' - ')[0]))) {
                degreeErrors.push({
                    type: 'degree',
                    attribute: 'time',
                    isValid: false,
                    message: 'Time must be a number.'
                });
            }
            if (!this.degree.correct) {
                degreeErrors.push({
                    type: 'degree',
                    attribute: 'correct',
                    isValid: false,
                    message: 'Correctness is required.'
                });
            }
            if (!this.degree.complete) {
                degreeErrors.push({
                    type: 'degree',
                    attribute: 'complete',
                    isValid: false,
                    message: 'Completeness is required.'
                });
            }
        } else {
            degreeErrors.push({
                type: 'degree',
                isValid: true
            });
        }
        return degreeErrors;
    }

    /**
     * Validates all required attributes of the employability object
     *
     * @returns <BuilderValidation>[] - Array of validation objects
     */
    validateEmployability(): BuilderValidation[] {
        const employabilityErrors: BuilderValidation[] = [];
        if (!this.employability.details) {
            employabilityErrors.push({
                type: 'employability',
                attribute: 'details',
                isValid: false,
                message: 'Employability is required'
            });
        } else {
            employabilityErrors.push({
                type: 'employability',
                isValid: true
            });
        }
        return employabilityErrors;
    }
}
