import { Types } from "mongoose";

export interface IQuestion {
  _id: Types.ObjectId;
  content: string;
  type: 'single' | 'multiple';
  category: 'sociometric' | 'preference' | 'behavioral';
}