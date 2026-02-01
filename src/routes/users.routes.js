import express from 'express';
import { body } from 'express-validator';

import { validate } from '../middleware/validate.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import * as usersController from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', requireAuth, requireRoles('ADMIN'), usersController.getUsers);

router.patch(
  '/:id/approve',
  requireAuth,
  requireRoles('ADMIN'),
  [body('approved').isBoolean()],
  validate,
  usersController.approveUser
);

router.patch(
  '/:id/role',
  requireAuth,
  requireRoles('ADMIN'),
  [body('role').isIn(['ADMIN', 'OFFICER', 'ANALYST'])],
  validate,
  usersController.updateUserRole
);

router.get('/me', requireAuth, usersController.getMe);
router.patch('/me', requireAuth, usersController.updateMe);

export default router;