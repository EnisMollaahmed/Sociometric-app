import { useNavigate, useParams } from 'react-router';//useLoaderData,
import { Form, Button, Dropdown, Alert } from 'react-bootstrap';
// import { Form as RouterForm } from 'react-router';
// import { Survey } from '../types/survey';
import IStudent from '../types/student';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Question } from '../types/quesion';

export default function StudentSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/surveys/${id}/student`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to load survey');
        
        setQuestions(data.data.questions);
        setStudents(data.data.students);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load survey');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleSelect = (questionId: string, studentId: string) => {
    setResponses(prev => {
      const current = prev[questionId] || [];
      const newResponses = current.includes(studentId)
        ? current.filter(id => id !== studentId)
        : [...current, studentId];
      
      return { ...prev, [questionId]: newResponses };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3000/api/surveys/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          surveyId: id,
          responses: Object.entries(responses).map(([questionId, selectedStudents]) => ({
            questionId,
            selectedStudents
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to submit survey');
      
      setSubmitted(true);
      logout();
      navigate('/student-login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-5">
        <h2>Thank You!</h2>
        <p>Your responses have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="survey-container p-4">
      <h2 className="mb-4">Classroom Survey</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        {questions.map(question => (
          <Form.Group key={question._id} className="mb-4 p-3 border rounded">
            <Form.Label className="fw-bold">{question.content}</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="light" className="w-100">
                {responses[question._id]?.length || 0} selected
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                {students.map(student => (
                  <Dropdown.Item 
                    key={student._id}
                    onClick={() => handleSelect(question._id, student._id)}
                    active={responses[question._id]?.includes(student._id)}
                  >
                    {student.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <small className="text-muted">
              {question.type === 'single' 
                ? 'Select one answer' 
                : 'Select multiple answers'}
            </small>
          </Form.Group>
        ))}
        
        <div className="d-flex justify-content-between">
          <Button variant="danger" onClick={() => {
            logout();
            navigate('/student-login');
          }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="success"
            disabled={loading || Object.keys(responses).length < questions.length}
          >
            {loading ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </div>
      </Form>
    </div>
  );
}