import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';

const router = express.Router();

router.post('/auth/sign-up', signUp);
router.post('/auth/sign-in', signIn);

export default router;