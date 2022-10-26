import { Workrole } from './workrole';

export interface Behavior {
  _id: string,
  task: string,
  details: string,
  workrole: Workrole
}
