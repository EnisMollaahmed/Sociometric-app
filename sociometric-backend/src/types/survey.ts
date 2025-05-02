import { Types } from 'mongoose';

export interface PopulatedQuestion {
  _id: Types.ObjectId;
  content: string;
  // other question properties
}

export interface PopulatedStudent {
  _id: Types.ObjectId;
  name: string;
  hasCompleted: boolean;
  responses: Array<{
    questionId: string;
    selectedStudents: string[];
  }>;
}

export interface SurveyResponse {
  questionId: string | Types.ObjectId;
  selectedStudents: string[];
}