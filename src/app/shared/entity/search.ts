import { Competency } from './competency';

export interface Search {
  competencies: Competency[]
  limit: number
  page: number
  total: number
  statuses: string[]
}
