import { useLoaderData } from 'react-router';
import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import SurveyCard from '../components/SurveyCard';
import { useAuth } from '../context/AuthContext';
import { SurveySummary } from '../types/survey-summary';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { surveys } = useLoaderData() as { surveys: SurveySummary[] };

  return (
    <main className="dashboard">
      <section className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="subtitle">Review your latest sociometric surveys</p>
      </section>
      
      <section className="dashboard-actions">
        <Button variant="primary" onClick={() => navigate('/create-survey')}>
          <FaPlus className="icon" />
          New Survey
        </Button>
      </section>

      <section className="recent-surveys">
        <h2>Recent Surveys</h2>
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onClick={() => navigate(`/survey/${survey.id}/results`)}
            />
          ))
        ) : (
          <p>No surveys found. Create your first survey!</p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;