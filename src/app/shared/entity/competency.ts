import { Actor } from './actor';
import { Behavior } from './behavior';
import { Condition } from './condition';
import { Degree } from './degree';
import { Employability } from './employability';
import { Lifecycles } from './lifecycles';
import { Notes } from './notes';

export class Competency {
    _id!: string;
    status!: Lifecycles;
    authorId!: string;
    version!: number;
    name!: string;
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
        name: string,
        actor: Actor,
        behavior: Behavior,
        condition: Condition,
        degree: Degree,
        employability: Employability,
        notes: Notes
    ) {
        this._id = _id;
        this.status = status;
        this.authorId = authorId;
        this.version = version;
        this.name = name;
        this.actor = actor;
        this.behavior = behavior;
        this.condition = condition;
        this.degree = degree;
        this.employability = employability;
        this.notes = notes;
    }

    get id() {
        return this._id;
    }

    get status$() {
        return this.status;
    }

    get authorId$() {
        return this.authorId;
    }

    get version$() {
        return this.version;
    }

    get name$() {
        return this.name;
    }

    get actor$() {
        return this.actor;
    }

    get behavior$() {
        return this.behavior;
    }

    get condition$() {
        return this.condition;
    }

    get degree$() {
        return this.degree;
    }

    get employability$() {
        return this.employability;
    }

    get notes$() {
        return this.notes;
    }
}
