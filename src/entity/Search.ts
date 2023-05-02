import { Competency } from './Competency';

export interface Search {
  competencies: Competency[]
  limit: number
  page: number
  total: number
  statuses: string[]
}

export function CompetencyCardSearch(id: string) {
  return `
    {
      competency(competencyId:"${id}") {
        
        status
        actor {
          type
        }
        behavior {
          tasks
          details
          work_role
        }
      }
    }
  `;
}
