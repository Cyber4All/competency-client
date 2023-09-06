import { DCWF_Workrole } from './dcwf.workrole';

export interface DCWF_Element {
    _id: string
    type: string,
    description: string,
    element_id: string
    work_roles?: DCWF_Workrole[]
}
