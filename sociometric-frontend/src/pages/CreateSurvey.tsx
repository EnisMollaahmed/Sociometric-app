import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Form as RouterForm } from 'react-router';

interface Question {
  _id: string;
  content: string;
  type: string;
  category: string;
}

export default function CreateSurvey() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetch('/api/questions',{headers: {
      Authorization: `Bearer ${token}`
    }})
      .then(res => res.json())
      .then(data => setQuestions(data.data))
      .catch(err => console.error('Failed to fetch questions', err));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    
    if (selectedQuestions.length < 3) {
      setError('Minimum 3 questions required');
      return;
    }

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization':  `Bearer ${token}`},
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          class: formData.get('class'),
          questions: selectedQuestions
        })
      });
      
      if (!response.ok) throw new Error('Failed to create survey');
      const { data } = await response.json();
      navigate(`/survey/${data._id}/generate-hashes`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="create-survey">
      <h1>Create New Survey</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <RouterForm onSubmit={handleSubmit}>
        <section className="form-section">
          <Form.Group>
            <Form.Label>Survey Title</Form.Label>
            <Form.Control name="title" required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Class</Form.Label>
            <Form.Control name="class" required />
          </Form.Group>
        </section>

        <section className="questions-section">
          <h2>Select Questions (3-4 required)</h2>
          
          <section className="questions-list">
            {questions.map(question => (
              <section key={question._id} className="question-item">
                <Form.Check
                  type="checkbox"
                  id={question._id}
                  label={question.content}
                  checked={selectedQuestions.includes(question._id)}
                  onChange={() => setSelectedQuestions(prev => 
                    prev.includes(question._id) 
                      ? prev.filter(id => id !== question._id) 
                      : [...prev, question._id]
                  )}
                />
                <small>{question.type} • {question.category}</small>
              </section>
            ))}
          </section>
        </section>

        <Button type="submit" disabled={selectedQuestions.length < 3}>
          Create Survey
        </Button>
      </RouterForm>
    </section>
  );
}