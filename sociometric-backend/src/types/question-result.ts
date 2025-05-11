export interface QuestionResult {
  questionId: string;
  questionContent: string;
  responses: {
    name: string;
    count: number;
    percentage: number;
  }[];
}