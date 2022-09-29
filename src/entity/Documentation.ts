import { Types } from "mongoose";

export interface Documentation {
  conditionId: Types.ObjectId,
  description: string,
  uri: string
}