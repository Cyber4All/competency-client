import { Workrole } from './workrole';

export interface Elements {
    _id: string
    element: string
    element_id: string
    description: string
    work_roles?: Workrole[]
}
