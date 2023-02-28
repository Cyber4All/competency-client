import { Actor } from '../../../entity/actor';
import { Behavior } from '../../../entity/behavior';
import { Competency } from '../../../entity/competency';
import { Condition } from '../../../entity/condition';
import { Degree } from '../../../entity/degree';
import { Documentation } from '../../../entity/documentation';
import { Employability } from '../../../entity/employability';
import { Lifecycles } from '../../../entity/lifecycles';
import { Notes } from '../../../entity/notes';

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

    setBehavior(update: {tasks: string[], work_role: string, details: string}) {
        this.behavior = update;
        return this;
    }

    setCondition(update: {limitations: string, tech: string[], documentation: Documentation[]}) {
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

    setNotes(updates: {details: string}) {
        this.notes = updates;
        return this;
    }

    build() {
        if (!this._id || this._id === null || this._id === undefined) {
            throw new Error('Competency ID is not valid');
        }
        if (!this.authorId || this.authorId === null || this.authorId === undefined) {
            throw new Error('Competency author is not valid');
        }
        if ((!this.status)) {
            throw new Error('Competency is not in a valid state');
        }
        if (!this.actor.details || !this.actor.type) {
            throw new Error('Actor is incomplete');
        }
        if (!this.behavior.details || !this.behavior.tasks || !this.behavior.work_role) {
            throw new Error('Behavior is incomplete');
        }
        if (!this.condition.limitations || !this.condition.tech) {
            throw new Error('Condition is incomplete');
        }
        if (!this.degree.time || !this.degree.complete || !this.degree.correct) {
            throw new Error('Degree is incomplete');
        }
        if (!this.employability.details) {
            throw new Error('Employability is incomplete');
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

}
