import { Survey } from "./survey";
import {QuestionResult} from './question-result';

export interface SurveyResultsData {
    survey: Survey;
    results: QuestionResult[];
    completionRate: number;
}