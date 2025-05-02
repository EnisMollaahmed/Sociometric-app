import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './layouts/RootLayout';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherSurveys from './pages/TeacherSurveys';
import SurveyResults from './pages/SurveyResult';
import CreateSurvey from './pages/CreateSurvey';
import GenerateHashes from './pages/GenerateHashes';
import StudentSurvey from './pages/StudentSurvey';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <TeacherSurveys />,
        loader: async () => {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:3000/api/surveys/teacher', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            // Handle specific HTTP errors
            if (response.status === 401) {
              window.location.href = '/login';
              return;
            }
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
          
          return await response.json();
        }
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'create-survey',
        element: <CreateSurvey />
      },
      {
        path: 'survey/:id/results',
        element: <SurveyResults />,
        loader: async ({ params }) => {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/surveys/${params.id}/results`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch results');
          return response.json();
        }
      },
      {
        path: 'survey/:id/generate-hashes',
        element: <GenerateHashes />
      },
      {
        path: 'survey/:id',
        element: <StudentSurvey />,
        loader: async ({ params }) => {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/surveys/${params.id}/student`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch survey');
          return response.json();
        }
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;