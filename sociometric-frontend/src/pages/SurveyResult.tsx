import { useLoaderData, useNavigate } from 'react-router';
import { Alert } from 'react-bootstrap';
import { SurveyResultsData } from '../types/survey-result';

export default function SurveyResults() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as 
    | { data: SurveyResultsData }
    | { error: string };

  // Handle error state
  if ('error' in loaderData) {
    return (
      <div className="p-4">
        <Alert variant="danger">
          {loaderData.error}
          <button 
            onClick={() => navigate(-1)}
            className="ms-3 btn btn-sm btn-outline-danger"
          >
            Go Back
          </button>
        </Alert>
      </div>
    );
  }

  // Destructure after error check
  const { data } = loaderData;

  return (
    <section className="survey-results p-4">
      <h1 className="mb-4">{data.survey.title} Results</h1>
      
      {/* Results summary */}
      <div className="results-summary mb-4 p-3 bg-light rounded">
        <div className="d-flex justify-content-between">
          <div className="text-center">
            <h3>{data.survey.students.length}</h3>
            <p>Total Students</p>
          </div>
          <div className="text-center">
            <h3>{data.completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Questions results */}
      {data.results.map((question) => (
        <div key={question.questionId} className="question-results mb-4 p-3 border rounded">
          <h2 className="h4">{question.questionContent}</h2>
          
          <ul className="list-unstyled">
            {question.responses.map((response, i) => (
              <li key={i} className="d-flex justify-content-between py-2 border-bottom">
                <span>{response.name}</span>
                <span>
                  {response.count} votes ({response.percentage}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}