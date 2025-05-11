// types/survey-result.ts
import { Survey } from "./survey";
import { QuestionResult } from './question-result';

export interface SurveyResultsData {
    survey: {
        _id: string;
        title: string;
        description?: string;
        students: StudentResponse[];
    };
    results: QuestionResult[];
    completionRate: number;
}

export interface StudentResponse {
    _id: string;
    name: string;
    hasCompleted: boolean;
    responses: {
        questionId: string;
        selectedStudents: string[];
    }[];
}

export interface PopulatedQuestion {
    _id: string;
    content: string;
    type: 'single' | 'multiple';
    category: 'sociometric' | 'preference' | 'behavioral';
}