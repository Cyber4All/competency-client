import { Actor } from './actor';
import { Behavior } from './Behavior';
import { Condition } from './Condition';
import { Degree } from './Degree';
import { Employability } from './Employability';
import { Lifecycles } from './Lifecycles';
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
          _id
          tasks
          details
          work_role
        }
        condition {
          _id
          scenario
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
          _id
          complete
          correct
          time
        }
        employability {
          _id
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
    workrole?: string[],
    task?: string[],
    version?: number
  }
) {
  return `
    {
      search(
        text:"${query?.text ?? ''}",
        page:${query?.page ?? 0},
        limit:${query?.limit ?? 0}, ${query?.author ? `\nauthor: "${query?.author}",` : ''}
        status:[${query?.status ?? 'DRAFT'}],
        ${query?.workrole && query.workrole.length > 0 ? `workrole:["${query.workrole.join('","')+'"'}],`: ''}
        ${query?.task && query.task.length > 0 ? `task:["${query.task.join('","')+'"'}],`: ''}
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
