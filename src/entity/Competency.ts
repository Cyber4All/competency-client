import { Audience } from './audience';
import { Behavior } from './behavior';
import { Condition } from './condition';
import { Degree } from './degree';
import { Employability } from './employability';
import { Lifecycles } from './lifecycles';

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
    query
      Query {
        competency(competencyId:"`+id+`") {
          audience {
            _id
            type
            details
          },
          behavior {
            _id
            task
            details
            work_role {
              _id
              name
              description
            }
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
