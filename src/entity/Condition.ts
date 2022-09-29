import { Documentation } from "./Documentation";

export interface Condition {
  _id: string,
  work_role: string,
  tech: string[],
  limitations: string,
  documentation: Documentation[]
}