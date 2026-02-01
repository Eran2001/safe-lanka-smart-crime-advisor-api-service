import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';

import { validate } from '../middleware/validate.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import * as crimeController from '../controllers/crime.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Read operations - all authenticated users
router.get('/', requireAuth, crimeController.getCrimeRecords);
router.get('/export.csv', requireAuth, crimeController.exportCrimeRecords);
router.get('/:id', requireAuth, crimeController.getCrimeRecord);

// Write operations - Admin and Officer only
router.post(
  '/',
  requireAuth,
  requireRoles('ADMIN', 'OFFICER'),
  writeLimiter,
  [
    body('date').isDate().withMessage('Valid date required'),
    body('time').matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Valid time required'),
    body('divisionId').isUUID().withMessage('Valid division ID required'),
    body('crimeTypeId').isUUID().withMessage('Valid crime type ID required'),
    body('locationLat').optional().isFloat({ min: 5.5, max: 10 }).withMessage('Latitude must be within Sri Lanka bounds'),
    body('locationLng').optional().isFloat({ min: 79, max: 82 }).withMessage('Longitude must be within Sri Lanka bounds'),
    body('count').optional().isInt({ min: 1 }).withMessage('Count must be at least 1'),
    body('address').optional().isString()
  ],
  validate,
  crimeController.createCrimeRecord
);

router.patch(
  '/:id',
  requireAuth,
  requireRoles('ADMIN', 'OFFICER'),
  writeLimiter,
  crimeController.updateCrimeRecord
);

router.delete(
  '/:id',
  requireAuth,
  requireRoles('ADMIN', 'OFFICER'),
  crimeController.deleteCrimeRecord
);

router.post(
  '/import',
  requireAuth,
  requireRoles('ADMIN', 'OFFICER'),
  upload.single('file'),
  crimeController.importCrimeRecords
);

export default router;