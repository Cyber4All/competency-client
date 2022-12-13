import { Documentation } from './Documentation';
export interface Condition {
  _id?: string,
  tech: string[],
  limitations: string,
  documentation: Documentation[],
}
