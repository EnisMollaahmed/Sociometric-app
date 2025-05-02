import { useLoaderData } from 'react-router';
import IStudent from '../types/student';
import { SurveyResultsData } from '../types/survey-result';

export default function SurveyResults() {
  const { data } = useLoaderData() as { data: SurveyResultsData };

  return (
    <section className="survey-results">
      <h1>{data.survey.title} Results</h1>
      
      <section className="results-summary">
        <section className="summary-item">
          <h3>{data.survey.students.length}</h3>
          <p>Total Students</p>
        </section>
        <section className="summary-item">
          <h3>{data.survey.students.filter((s: IStudent) => s.hasCompleted).length}</h3>
          <p>Responses</p>
        </section>
        <section className="summary-item">
          <h3>{data.completionRate}%</h3>
          <p>Completion Rate</p>
        </section>
      </section>

      {data.results.map((question, idx) => (
        <section key={question.questionId} className="question-results">
          <h2>Question {idx + 1}: {question.questionContent}</h2>
          
          <section className="responses-list">
            {question.responses.map((response, i) => (
              <section key={i} className="response-item">
                <span className="student-name">{response.name}</span>
                <span className="vote-count">{response.count} votes</span>
                <span className="percentage-badge">
                  {response.percentage}%
                </span>
              </section>
            ))}
          </section>
        </section>
      ))}
    </section>
  );
}