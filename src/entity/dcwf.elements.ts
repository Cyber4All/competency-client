import { DCWF_Workrole } from './dcwf.workrole';

export interface DCWF_Element {
    _id: string
    element: string
    element_id: string
    description: string
    work_roles?: DCWF_Workrole[]
}
