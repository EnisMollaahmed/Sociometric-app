import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const StudentLogin = () => {
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid access code');
      }

      login(data.token, 'student');
      navigate(`/survey/${data.surveyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4" style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Student Access</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Your Access Code</Form.Label>
              <Form.Control
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Paste your access code here"
                required
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Accessing...' : 'Access Survey'}
            </Button>

            <div className="text-center mt-3">
              <p className="text-muted">Are you a teacher?</p>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/login')}
                className="w-100"
              >
                Go to Teacher Login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentLogin;