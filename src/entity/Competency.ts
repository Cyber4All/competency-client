import { Audience } from './Audience';
import { Behavior } from './Behavior';
import { Condition } from './Condition';
import { Degree } from './Degree';
import { Employability } from './Employability';
import { Lifecycles } from './Lifecycles';

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
