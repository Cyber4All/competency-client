import { Documentation } from './documentation';
export interface Condition {
  _id?: string,
  scenario: string,
  tech: string[],
  limitations: string,
  documentation: Documentation[],
}
