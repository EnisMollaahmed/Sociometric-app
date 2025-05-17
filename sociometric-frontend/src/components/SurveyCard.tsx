import { Card } from 'react-bootstrap';
import { SurveySummary } from '../types/survey-summary';

interface SurveyCardProps {
  survey: SurveySummary;
  onClick: () => void;
}

const SurveyCard = ({ survey, onClick }: SurveyCardProps) => {
  // Calculate completion percentage safely
  const participationPercentage = `${Math.round(parseFloat(survey.participation))}%`;
  return (
    <Card className="survey-card" onClick={onClick}>
      <Card.Body>
        <Card.Title>{survey.title}</Card.Title>
        <Card.Subtitle className="survey-meta">
          {survey.date} • {participationPercentage}
        </Card.Subtitle>
        <section className="survey-stats">
          <div className="stat-item">
            <span className="stat-label">Most Popular: </span>
            <span className="stat-value popular">{survey.popularStudent || 'N/A'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Rejected: </span>
            <span className="stat-value rejected">{survey.rejectedStudent || 'N/A'}</span>
          </div>
        </section>
      </Card.Body>
    </Card>
  );
};

export default SurveyCard;