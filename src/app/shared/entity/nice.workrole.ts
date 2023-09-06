import { Elements } from './nice.elements';
export interface Workrole {
  _id: string
  work_role: string
  work_role_id: string
  description: string
  ksats: []
  special_area: string
  tasks?: Elements[]
}
