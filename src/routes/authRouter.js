import express from 'express';
import { signUp } from '../controllers/authController.js';

const router = express.Router();

router.post('auth/sign-up', signUp);

export default router;