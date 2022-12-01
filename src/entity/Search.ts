import { Competency } from './Competency';

export interface Search {
    competencies: Competency[]
    limit: number
    page: number
    total: number
}
