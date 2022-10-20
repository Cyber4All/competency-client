import { Documentation } from './Documentation';
import { Workrole } from './workrole';
export interface Condition {
  _id: string,
  tech: string[],
  limitations: string,
  documentation: Documentation[],
  workRole: Workrole,
}
