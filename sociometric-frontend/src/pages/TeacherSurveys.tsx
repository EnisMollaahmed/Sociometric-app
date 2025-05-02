import { useLoaderData } from 'react-router';
import { LinkButton } from '../components/LinkButton'; // Adjust path as needed
import { FaPlus, FaChartBar } from 'react-icons/fa';

interface Survey {
  _id: string;
  title: string;
  class: string;
  status: string;
  students: { hasCompleted: boolean }[];
  createdAt: string;
}

export default function TeacherSurveys() {
  const { data: surveys } = useLoaderData() as { data: Survey[] };

  const getCompletionPercentage = (survey: Survey) => {
    const completed = survey.students.filter(s => s.hasCompleted).length;
    return Math.round((completed / survey.students.length) * 100);
  };

  return (
    <section className="teacher-surveys">
      <section className="surveys-header">
        <h1>My Surveys</h1>
        <LinkButton to="/create-survey">
          <FaPlus className="me-2" />
          Create New Survey
        </LinkButton>
      </section>

      {surveys.map(survey => (
        <section key={survey._id} className="survey-card">
          <section className="survey-header">
            <h2>{survey.title}</h2>
            <span className={`status-badge ${survey.status}`}>
              {survey.status}
            </span>
          </section>
          
          <section className="survey-meta">
            <span>{survey.class}</span>
            <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
          </section>

          <section className="survey-progress">
            <span>Completion: {getCompletionPercentage(survey)}%</span>
            <progress 
              value={getCompletionPercentage(survey)} 
              max="100"
              className={getCompletionPercentage(survey) === 100 ? 'complete' : ''}
            />
          </section>

          <section className="survey-actions">
            <LinkButton 
              to={`/survey/${survey._id}/results`}
              variant="outline-primary"
            >
              <FaChartBar className="me-2" />
              View Results
            </LinkButton>
          </section>
        </section>
      ))}
    </section>
  );
}