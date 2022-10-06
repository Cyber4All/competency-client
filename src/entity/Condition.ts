import { Documentation } from './Documentation';

export interface Condition {
  _id: string,
  workRole: string,
  tech: string[],
  limitations: string,
  documentation: Documentation[]
}
