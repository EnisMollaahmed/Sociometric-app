export interface SurveyResultsData {
  survey: {
    _id: string;
    title: string;
    description?: string;
    students: {
      _id: string;
      name: string;
      hasCompleted: boolean;
    }[];
  };
  results: {
    questionId: string;
    questionContent: string;
    responses: {
      name: string;
      count: number;
      percentage: number;
    }[];
  }[];
  completionRate: number;
}