import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Alert, Button } from 'react-bootstrap';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const navigate = useNavigate();

  let errorMessage = 'An unexpected error occurred';
  let errorStatus:number = 404;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText;
    
    if (error.data?.message) {
      errorMessage = error.data.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <section className="error-page container">
      <section className="text-center">
        <FaExclamationTriangle size={48} className="text-danger mb-4" />
        <h1 className="mb-3">Oops!</h1>
        
        {errorStatus && (
          <h2 className="mb-3 text-muted">{errorStatus}</h2>
        )}
        
        <Alert variant="danger" className="mb-4">
          <p className="mb-0">{errorMessage}</p>
        </Alert>

        <Button onClick={()=>navigate('/')} variant="primary">
          <FaHome className="me-2" />
          Return Home
        </Button>
      </section>
    </section>
  );
}