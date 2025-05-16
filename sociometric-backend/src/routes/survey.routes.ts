import express from 'express';
import {
  getTeacherSurveys,
  getSurveyResults,
  createSurvey,
  getSurveyForStudent,
  submitSurvey,
  getQuestions,
  generateStudentHashes,
  updateSurvey,
  activateSurvey
} from '../controllers/survey.controller';
import { protect, teacherOnly } from '../middlewares/auth.middleware';
import Question from '../models/Question';

const router = express.Router();

router.use(protect);

router.get('/questions', teacherOnly, getQuestions);
router.get('/teacher', teacherOnly, getTeacherSurveys);
router.get('/:id/results', teacherOnly, getSurveyResults);
router.post('/', teacherOnly, createSurvey);
router.post('/:id/generate-hashes', teacherOnly, generateStudentHashes);
router.get('/:id/student', getSurveyForStudent);
router.post('/submit', submitSurvey);// Should have this route
router.patch('/:id', teacherOnly, updateSurvey);
router.patch('/:id/activate', teacherOnly, activateSurvey);
router.post('/questions/validate', teacherOnly, async (req, res) => {
  try {
    const { questionIds } = req.body;
    const questions = await Question.find({ _id: { $in: questionIds } });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

export default router;