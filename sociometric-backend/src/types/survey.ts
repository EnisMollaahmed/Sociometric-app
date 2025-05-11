import { Types } from 'mongoose';
import { IQuestion } from './question';
import { IStudent } from './student';

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

export interface ISurvey {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  teacher: Types.ObjectId;
  class: string;
  questions: Types.ObjectId[] | IQuestion[];
  students: Types.ObjectId[] | IStudent[];
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
  expiresAt?: Date;
}

// Frontend-friendly version (optional)
export interface Survey {
  _id: string;
  title: string;
  description?: string;
  class: string;
  questions: string[]; // Just IDs or full questions if populated
  status: 'draft' | 'active' | 'completed';
}