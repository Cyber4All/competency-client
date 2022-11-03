import { Workrole } from './workrole';

export interface Behavior {
  _id: string,
  task: string,
  details: string,
  work_role: Workrole
}
