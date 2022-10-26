import { Audience } from './audience';
import { Behavior } from './behavior';
import { Condition } from './condition';
import { Degree } from './degree';
import { Employability } from './employability';
import { Lifecycles } from './lifecycles';

export interface Competency {
  _id: string,
  status: Lifecycles,
  authorId: string,
  version: number,
  audience: Audience,
  condition: Condition,
  behavior: Behavior,
  degree: Degree,
  employability: Employability
}
