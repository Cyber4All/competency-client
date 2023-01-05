import { Audience } from './Audience';
import { Behavior } from './Behavior';
import { Condition } from './Condition';
import { Degree } from './Degree';
import { Employability } from './Employability';
import { Lifecycles } from './Lifecycles';

export interface Competency {
  _id: string,
  status: Lifecycles,
  authorId: string,
  version: number,
  audience: Audience,
  condition: Condition,
  behavior: Behavior,
  degree: Degree,
  employability: Employability
}

export function CompetencyGraph(id: string) {
  return `
    {
      competency(competencyId:"${id}") {
        _id
        status,
        authorId,
        version,
        audience {
          type
          details
        },
        behavior {
          tasks
          details
          work_role
        },
        condition {
          tech
          limitations
          documentation {
              _id
              conditionId
              description
              uri
          }
        },
        degree {
          complete
          correct
          time
        },
        employability {
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
