import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import SurveyCard from '../components/SurveyCard';
import { useAuth } from '../context/AuthContext';

interface Survey {
  id: string;
  title: string;
  date: string;
  popularStudent: string;
  rejectedStudent: string;
  participation: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { data } = await axios.get('/api/surveys', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSurveys(data.data);
      } catch (err) {
        setError('Failed to fetch surveys');
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [logout]);

  if (loading) return <section className="loading">Loading surveys...</section>;
  if (error) return <section className="error">{error}</section>;

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
        {surveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            survey={survey}
            onClick={() => navigate(`/survey/${survey.id}`)}
          />
        ))}
      </section>
    </main>
  );
};

export default Dashboard;