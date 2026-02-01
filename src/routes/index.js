import express from 'express';

import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import crimeRoutes from './crime.routes.js';
import predictionsRoutes from './predictions.routes.js';
import { 
  feedbackRouter, 
  notificationsRouter, 
  divisionsRouter, 
  crimeTypesRouter, 
  reportsRouter, 
  blogRouter 
} from './common.routes.js';
import { config } from '../config/env.js';
import { emailOutbox } from '../email/mailer.js';

const router = express.Router();

// Health check endpoints
router.get('/health/live', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/health/ready', async (req, res) => {
  try {
    // Check database connection
    const db = (await import('../db/knex.js')).default;
    await db.raw('SELECT 1');
    
    res.json({ 
      status: 'ready', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'not ready', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Debug endpoint for email outbox (dev only)
if (config.env === 'development') {
  router.get('/debug/outbox', (req, res) => {
    res.json({
      success: true,
      data: {
        emails: emailOutbox,
        count: emailOutbox.length
      }
    });
  });
}

// API routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/crime-records', crimeRoutes);
router.use('/predictions', predictionsRoutes);
router.use('/feedback', feedbackRouter);
router.use('/notifications', notificationsRouter);
router.use('/divisions', divisionsRouter);
router.use('/crime-types', crimeTypesRouter);
router.use('/reports', reportsRouter);
router.use('/blog', blogRouter);

export default router;