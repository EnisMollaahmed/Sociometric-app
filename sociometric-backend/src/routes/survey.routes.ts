import express from 'express';
import {
  getTeacherSurveys,
  getSurveyResults,
  createSurvey,
  getSurveyForStudent,
  submitSurvey
} from '../controllers/survey.controller';
import { protect, teacherOnly } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/teacher', teacherOnly, getTeacherSurveys);
router.get('/:id/results', teacherOnly, getSurveyResults);
router.post('/', teacherOnly, createSurvey);
router.get('/:id/student', getSurveyForStudent);
router.post('/submit', submitSurvey);

export default router;