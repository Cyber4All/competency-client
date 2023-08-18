import { DCWF_Element } from './dcwf.elements';
export interface DCWF_Workrole {
  _id: string,
  category: string,
  work_role: string,
  dcwf_id: string,
  description: string,
  tasks?: [DCWF_Element]
}
