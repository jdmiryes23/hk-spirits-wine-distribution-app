import { Router } from 'express';
import { identityController } from './identity.controller';
import { authMiddleware } from '../../../apps/api/src/middleware/auth';

export const identityRouter = Router();

// POST /api/v1/auth/register
identityRouter.post('/register', identityController.register);

// POST /api/v1/auth/login
identityRouter.post('/login', identityController.login);

// GET /api/v1/auth/me  (protected)
identityRouter.get('/me', authMiddleware, identityController.me);
