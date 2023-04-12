import { Competency } from './competency';

export interface Search {
  competencies: Competency[]
  limit: number
  page: number
  total: number
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
