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

export function CompetencyGraph(id: string) {
  return `
    {
      competency(competencyId:"${id}") {
        _id
        status
        authorId
        version
        actor {
          _id
          type
          details
        }
        behavior {
          tasks
          details
          work_role
        }
        condition {
          tech
          limitations
          documentation {
              _id
              conditionId
              description
              uri
          }
        }
        degree {
          complete
          correct
          time
        }
        employability {
          details
        },
        notes {
          _id
          details
        }
      }
    }
  `;
}

export function CompetencySearch(
  query?: {
    text?: string,
    page?: number,
    limit?: number,
    author?: string,
    status?: string[],
    version?: number
  }
) {
  return `
    {
      search(
        text:"${query?.text ?? ''}",
        page:${query?.page ?? 0},
        limit:${query?.limit ?? 0}, 
        author:"${query?.author ?? ''}",
        status:[${query?.status ?? 'DRAFT'}],
        version:${query?.version ?? 0}
      ) {
        competencies {
          _id
        }
        total
        page
        limit
      }
    }
  `;
}
