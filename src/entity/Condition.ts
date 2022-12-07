import { Documentation } from './documentation';
export interface Condition {
  _id?: string,
  tech: string[],
  limitations: string,
  documentation: Documentation[],
}
