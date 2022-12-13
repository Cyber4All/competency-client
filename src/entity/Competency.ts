import { Audience } from './Audience';
import { Behavior } from './Behavior';
import { Condition } from './Condition';
import { Degree } from './Degree';
import { Employability } from './Employability';
import { Lifecycles } from './Lifecycles';

export interface Competency {
  id: string,
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
        status,
        authorId,
        version,
        audience {
          type
          details
        },
        behavior {
          task
          details
        },
        condition {
          tech
          limitations
          work_role
          documentation {
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
          id
        }
        total
        page
        limit
      }
    }
  `;
}
