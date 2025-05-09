import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, Table, Alert, Form } from 'react-bootstrap';
import axios from 'axios';

const GenerateHashes = () => {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();
  const [students, setStudents] = useState<{name: string; hash: string}[]>([]);
  const [studentNames, setStudentNames] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateHashes = async () => {
    try {
      if (!studentNames.trim()) {
        setError('Please enter student names');
        return;
      }

      setLoading(true);
      const namesArray = studentNames.split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');

      const token = localStorage.getItem("token");
      console.log('token', token)
      const { data } = await axios.post(
        `http://localhost:3000/api/surveys/${id}/generate-hashes`,
        {
          studentNames: namesArray
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Make sure this matches your token
          }
        }
      );;
      console.log('students',  studentNames)
      setStudents(data.data);
      setError('');
    } catch (err) {
      setError('Failed to generate access codes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activateSurvey = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/api/surveys/${id}`, { 
        status: 'active',
        students: students.map(s => s.hash) // Save hashes to survey
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Make sure this matches your token
        }
      },
    );
      navigate('/teacher-surveys');
    } catch (err) {
      setError('Failed to activate survey');
      console.error(err);
    }
  };

  return (
    <div className="generate-hashes p-4">
      <h1 className="mb-4">Generate Student Access Codes</h1>
      
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Form.Group className="mb-4">
        <Form.Label>Enter Student Names (one per line)</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          value={studentNames}
          onChange={(e) => setStudentNames(e.target.value)}
          placeholder="John Doe&#10;Jane Smith&#10;..."
          disabled={students.length > 0}
        />
      </Form.Group>

      <div className="mb-4">
        <Button 
          onClick={generateHashes}
          disabled={loading || students.length > 0}
          size="lg"
        >
          {loading ? 'Generating...' : 'Generate Access Codes'}
        </Button>
      </div>

      {students.length > 0 && (
        <>
          <h3 className="mb-3">Generated Access Codes</h3>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Access Code</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={student.hash}>
                  <td>{i + 1}</td>
                  <td>{student.name}</td>
                  <td className="font-monospace">{student.hash}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="outline-primary" 
              onClick={() => navigator.clipboard.writeText(
                students.map(s => `${s.name}: ${s.hash}`).join('\n')
              )}
            >
              Copy All Codes
            </Button>
            <Button variant="success" onClick={activateSurvey}>
              Activate Survey & Finish
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateHashes;