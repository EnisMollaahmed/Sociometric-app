import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const GenerateHashes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<{name: string; hash: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateHashes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/surveys/${id}/generate-hashes`, {
        studentNames: Array(25).fill('').map((_, i) => `Student ${i+1}`)
      });
      setStudents(data.data);
    } catch (err) {
      setError('Failed to generate access codes');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const activateSurvey = async () => {
    try {
      await axios.patch(`/api/surveys/${id}`, { status: 'active' });
      navigate('/teacher-surveys');
    } catch (err) {
      setError('Failed to activate survey');
      console.log(err)
    }
  };

  return (
    <div className="generate-hashes">
      <h1 className="mb-4">Student Access Codes</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <Button 
          onClick={generateHashes} 
          disabled={loading || students.length > 0}
        >
          {loading ? 'Generating...' : 'Generate Access Codes'}
        </Button>
      </div>

      {students.length > 0 && (
        <>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Student</th>
                <th>Access Code</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={i}>
                  <td>{student.name}</td>
                  <td>{student.hash}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="mt-4">
            <Button variant="success" onClick={activateSurvey}>
              Activate Survey
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateHashes;