import express from 'express';

const router = express.Router();
import { logout, checkAuth } from '../../controllers/private/authPrivate.controller.js';

router.get('/auth/logout',  logout);
router.get('/auth/checkHealth', checkAuth);

export default router;