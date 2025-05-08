import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const StudentLogin = () => {
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:3000/api/auth/student-login', {
        hash
      });

      if (response.data.success) {
        localStorage.setItem('studentToken', response.data.token);
        navigate(`/survey/${response.data.surveyId}`);
      } else {
        setError('Invalid access code');
      }
    } catch (err) {
      setError('Invalid access code or survey not found');
      console.error(err);
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
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Access Survey'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentLogin;