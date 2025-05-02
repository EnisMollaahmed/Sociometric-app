import { useLoaderData } from 'react-router';
import { Form, Button } from 'react-bootstrap';
import { Form as RouterForm } from 'react-router';
import { Survey } from '../types/survey';
import IStudent from '../types/student';

export default function StudentSurvey() {
  const { data: survey } = useLoaderData() as { data: Survey };

  return (
    <section className="student-survey">
      <h1>{survey.title}</h1>
      {survey.description && <p>{survey.description}</p>}

      <RouterForm 
        method="post" 
        action={`/api/surveys/submit`}
        encType="application/x-www-form-urlencoded"
      >
        <input type="hidden" name="surveyId" value={survey._id} />
        
        {survey.questions?.map((question) => (
          <section key={question._id} className="survey-question">
            <h2>{question.content}</h2>
            
            <section className="student-choices">
              {survey.students.map((student: IStudent) => (
                <Form.Check
                  key={student._id}
                  type={question.type === 'single' ? 'radio' : 'checkbox'}
                  name={`responses[${question._id}]`}
                  label={student.name}
                  value={student.name}
                />
              ))}
            </section>
          </section>
        ))}

        <Button type="submit">Submit Survey</Button>
      </RouterForm>
    </section>
  );
}