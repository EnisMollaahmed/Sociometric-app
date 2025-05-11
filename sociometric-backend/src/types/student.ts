import { Types } from 'mongoose';

export interface IStudent {
  _id: Types.ObjectId;
  name: string;
  hash: string;
  survey: Types.ObjectId;
  class: string;
  responses: {
    questionId: Types.ObjectId;
    selectedStudents: Types.ObjectId[];
  }[];
  hasCompleted: boolean;
}