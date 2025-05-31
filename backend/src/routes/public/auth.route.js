import express from 'express';

import { register, login } from "../../controllers/public/auth.controller.js";
import {googleAuth} from "../../controllers/public/googleAuth.controller.js";
import { rateLimitMiddleware } from '../../middlewares/rateLimitMiddleware.js';
const router = express.Router();

router.post('/register',  register);
router.post('/login' , login);
router.post('/google' ,rateLimitMiddleware, googleAuth);

export default router;

