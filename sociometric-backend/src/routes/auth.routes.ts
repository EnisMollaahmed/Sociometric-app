import express from 'express';
import {
  register,
  login,
  studentLogin,
  getMe,
  generateStudentHashes
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/student-login', studentLogin);
router.get('/me', getMe);
router.post('/generate-hashes', generateStudentHashes);

export default router;