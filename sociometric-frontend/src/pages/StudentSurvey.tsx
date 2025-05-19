import { useLoaderData, useNavigate, useParams } from 'react-router';
import { Form, Button, Dropdown, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Question } from '../types/quesion';
import IStudent from '../types/student';


export default function StudentSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { questions, students } = useLoaderData() as {
    questions: Question[];
    students: IStudent[];
  };
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="text-center p-5">
        <Alert variant="danger">No questions found for this survey</Alert>
        <Button onClick={() => navigate('/student-login')} variant="primary">
          Back to Login
        </Button>
      </div>
    );
  }
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
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/surveys/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          surveyId: id, // From useParams
          responses: Object.entries(responses).map(([questionId, selectedStudents]) => ({
            questionId,
            selectedStudents
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }
      
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