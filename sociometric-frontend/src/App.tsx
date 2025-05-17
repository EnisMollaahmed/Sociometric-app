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
import StudentLogin from './pages/StudentLogin';
import Dashboard from './pages/Dashboard';
import { SurveySummary } from './types/survey-summary';
import { Survey } from './types/survey';
import { formatSurveyDate, getMostPopularStudent, getMostRejectedStudent, calculateParticipationRate } from './utils/sociometric-calcs';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: async (): Promise<{ surveys: SurveySummary[] }> => {
          const token = localStorage.getItem('token');
          if (!token) {
            window.location.href = '/login';
            return { surveys: [] };
          }

          try {
            const response = await fetch('http://localhost:3000/api/surveys/teacher', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              if (response.status === 401) {
                window.location.href = '/login';
                return { surveys: [] };
              }
              throw new Error(`Failed to fetch surveys: ${response.statusText}`);
            }
            
            const data = await response.json();
            const surveys: Survey[] = data.data;
            // Transform to SurveySummary using helper functions
            const surveySummaries: SurveySummary[] = surveys.reverse().splice(0,3).map(survey => {
              return({
              id: survey._id,
              title: survey.title,
              date: formatSurveyDate(survey.createdAt),
              popularStudent: getMostPopularStudent(survey),
              rejectedStudent: getMostRejectedStudent(survey),
              participation: calculateParticipationRate(survey.students)
            })});

            return { surveys: surveySummaries };
          } catch (error) {
            console.error('Error loading surveys:', error);
            return { surveys: [] };
          }
        }
      },
      {
        path:'my-surveys',
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
          try {
            const response = await fetch(
              `http://localhost:3000/api/surveys/${params.id}/results`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (!response.ok) {
              if (response.status === 401) {
                window.location.href = '/login';
                return { error: 'Unauthorized' };
              }
              throw new Error(`Failed to fetch results: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.data) {
              throw new Error('Invalid data format from server');
            }

            return { data: result.data };  // Ensure we're passing data directly
          } catch (error) {
            console.error('Loader error:', error);
            return { 
              error: error instanceof Error ? error.message : 'Failed to load results' 
            };
          }
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
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            `http://localhost:3000/api/surveys/${params.id}/student`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (!data.data) {
            throw new Error("Invalid data format from server");
          }

          return {
            questions: data.data.questions || [],
            students: data.data.students || []
          };
        } catch (error) {
          console.error("Loader error:", error);
          throw new Error("Failed to load survey data");
        }
      },
        errorElement: <ErrorPage />
      },
      {
        path: 'student-login',
        element: <StudentLogin />
      }
    ]
  }
]);

/*
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
*/
function App() {
  return <RouterProvider router={router} />;
}

export default App;