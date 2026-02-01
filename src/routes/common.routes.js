import express from 'express';
import { body } from 'express-validator';

import { validate } from '../middleware/validate.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import * as commonController from '../controllers/common.controller.js';

// Feedback Routes
export const feedbackRouter = express.Router();

feedbackRouter.get('/', requireAuth, commonController.getFeedback);
feedbackRouter.post(
  '/',
  requireAuth,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('category').isIn(['usability', 'accuracy', 'features', 'other']),
    body('comment').optional().trim()
  ],
  validate,
  commonController.createFeedback
);

// Notifications Routes
export const notificationsRouter = express.Router();

notificationsRouter.get('/', requireAuth, commonController.getNotifications);
notificationsRouter.post(
  '/',
  requireAuth,
  requireRoles('ADMIN'),
  [
    body('message').isString().isLength({ max: 255 }),
    body('level').isIn(['info', 'warning', 'critical'])
  ],
  validate,
  commonController.createNotification
);

// Divisions Routes
export const divisionsRouter = express.Router();

divisionsRouter.get('/', commonController.getDivisions);
divisionsRouter.post(
  '/',
  requireAuth,
  requireRoles('ADMIN'),
  [
    body('name').trim().isLength({ min: 1, max: 120 }),
    body('code').trim().isLength({ min: 1, max: 20 })
  ],
  validate,
  commonController.createDivision
);

// Crime Types Routes
export const crimeTypesRouter = express.Router();

crimeTypesRouter.get('/', commonController.getCrimeTypes);
crimeTypesRouter.post(
  '/',
  requireAuth,
  requireRoles('ADMIN'),
  [body('name').trim().isLength({ min: 1, max: 120 })],
  validate,
  commonController.createCrimeType
);

// Reports Routes
export const reportsRouter = express.Router();

reportsRouter.get('/summary', requireAuth, commonController.getSummary);
reportsRouter.get('/download.csv', requireAuth, commonController.downloadCSV);
reportsRouter.get('/download.pdf', requireAuth, commonController.downloadPDF);

// Blog Routes
export const blogRouter = express.Router();

blogRouter.get('/', commonController.getBlogPosts);
blogRouter.get('/:slug', commonController.getBlogPost);
blogRouter.post(
  '/',
  requireAuth,
  requireRoles('ADMIN'),
  [
    body('slug').trim().isLength({ min: 1, max: 160 }),
    body('title').trim().isLength({ min: 1, max: 160 }),
    body('excerpt').optional().trim().isLength({ max: 280 }),
    body('contentMd').optional().trim(),
    body('author').optional().trim(),
    body('status').optional().isIn(['draft', 'published'])
  ],
  validate,
  commonController.createBlogPost
);
blogRouter.patch('/:id', requireAuth, requireRoles('ADMIN'), commonController.updateBlogPost);
blogRouter.delete('/:id', requireAuth, requireRoles('ADMIN'), commonController.deleteBlogPost);