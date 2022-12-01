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
    query {
      competency(competencyId:"${id}") {
        _id
        status
        authorId
        version
        audience {
          _id
          type
          details
        },
        behavior {
          _id
          tasks
          details
          work_role
        },
        condition {
          _id
          tech
          limitations
          documentation {
            conditionId
            description
            uri
          }
        },
        degree {
          _id
          complete
          correct
          time
        },
        employability {
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
    query {
      search(text:"${query?.text ?? ''}",
      page:${query?.page ?? 0},
      limit:${query?.limit ?? 0}, 
      author:"${query?.author ?? ''}",
      status:[${query?.status ?? ''}],
      version:${query?.version ?? 0}) {
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
