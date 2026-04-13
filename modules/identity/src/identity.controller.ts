import { Request, Response, NextFunction } from 'express';
import { identityService } from './identity.service';
import { AuthRequest } from '../../../apps/api/src/middleware/auth';

export const identityController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.headers['x-tenant-id'] as string || 'default';
      const user = await identityService.register(req.body, tenantId);
      res.status(201).json({ data: user });
    } catch (err) { next(err); }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await identityService.login(req.body);
      res.json({ data: result });
    } catch (err) { next(err); }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
      const user = await identityService.getById(req.user.id);
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      res.json({ data: user });
    } catch (err) { next(err); }
  },
};
