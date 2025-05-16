import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Form as RouterForm } from 'react-router';

interface QuestionFromAPI {
  _id: string;
  content: string;
  type: 'single' | 'multiple';
  category: 'sociometric' | 'preference' | 'behavioral';
}

export default function CreateSurvey() {
  const [questions, setQuestions] = useState<QuestionFromAPI[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const response = await fetch('/api/surveys/questions', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch questions');
        
        const { data } = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error('Failed to fetch questions', err);
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    if (token) fetchQuestions();
  }, [token]);

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestions(prev => {
      const newSelection = prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId];
      console.log('Updated selection:', newSelection);
      return newSelection;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    
    if (selectedQuestions.length < 3) {
      setError('Minimum 3 questions required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/surveys/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          class: formData.get('class'),
          questions: selectedQuestions
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Survey creation failed');
      }

      navigate(`/survey/${responseData.data._id}/generate-hashes`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create survey'
      );
    }
  };

  return (
    <section className="create-survey">
      <h1 className="mb-4">Create New Survey</h1>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <RouterForm onSubmit={handleSubmit}>
        <section className="form-section mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Survey Title</Form.Label>
            <Form.Control 
              name="title" 
              required 
              placeholder="Enter survey title"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              name="description" 
              rows={3} 
              placeholder="Optional survey description"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Class</Form.Label>
            <Form.Control 
              name="class" 
              required 
              placeholder="Enter class name"
            />
          </Form.Group>
        </section>

        <section className="questions-section mb-4">
          <h2 className="mb-3">
            Select Questions ({selectedQuestions.length} selected, minimum 3 required)
          </h2>
          
          <section className="questions-list">
            {isLoadingQuestions ? (
              <section className="loading-spinner text-center py-4">
                <section className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </section>
                <p className="mt-2">Loading questions...</p>
              </section>
            ) : questions.length === 0 ? (
              <Alert variant="info">No questions available to select</Alert>
            ) : (
              questions.map(question => (
                <section 
                  key={question._id} 
                  className={`question-item p-3 mb-2 rounded ${selectedQuestions.includes(question._id) ? 'selected-question' : ''}`}
                >
                  <Form.Check
                    type="checkbox"
                    id={`question-${question._id}`}
                    label={question.content}
                    checked={selectedQuestions.includes(question._id)}
                    onChange={() => handleQuestionSelect(question._id)}
                    name={`question-${question._id}`}
                    className="mb-1"
                  />
                  <small className="text-muted d-block mt-1">
                    {question.type === 'single' ? 'Single choice' : 'Multiple choice'} • 
                    {question.category === 'sociometric' ? 'Sociometric' : 
                     question.category === 'preference' ? 'Preference' : 'Behavioral'}
                  </small>
                </section>
              ))
            )}
          </section>
        </section>

        <section className="text-end">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            disabled={selectedQuestions.length < 3}
          >
            Create Survey
          </Button>
        </section>
      </RouterForm>
    </section>
  );
}