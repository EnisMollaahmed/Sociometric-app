import { Card } from 'react-bootstrap'
import StatItem from './StatItem'
import { SurveySummary } from '../types/survey-summary'

interface SurveyCardProps {
  survey: SurveySummary
  onClick: () => void
}

const SurveyCard = ({ survey, onClick }: SurveyCardProps) => (
  <Card className="survey-card" onClick={onClick}>
    <Card.Body>
      <Card.Title>{survey.title}</Card.Title>
      <Card.Subtitle className="survey-meta">
        {survey.date} • {survey.participation}
      </Card.Subtitle>
      <section className="survey-stats">
        <StatItem label="Most Popular" value={survey.popularStudent} type="popular" />
        <StatItem label="Rejected" value={survey.rejectedStudent} type="rejected" />
      </section>
    </Card.Body>
  </Card>
)

export default SurveyCard