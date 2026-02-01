// predictions.routes.js
import express from 'express';

import { requireAuth, requireRoles } from '../middleware/auth.js';
import * as predictionsController from '../controllers/predictions.controller.js';

const router = express.Router();

router.get('/heatmap', requireAuth, predictionsController.getHeatmap);
router.post('/heatmap', requireAuth, requireRoles('ADMIN'), predictionsController.createHeatmapZone);
router.patch('/heatmap/:id', requireAuth, requireRoles('ADMIN'), predictionsController.updateHeatmapZone);
router.delete('/heatmap/:id', requireAuth, requireRoles('ADMIN'), predictionsController.deleteHeatmapZone);

router.get('/trends', requireAuth, predictionsController.getTrends);
router.post('/trends', requireAuth, requireRoles('ADMIN'), predictionsController.createTrendPoint);
router.patch('/trends/:id', requireAuth, requireRoles('ADMIN'), predictionsController.updateTrendPoint);
router.delete('/trends/:id', requireAuth, requireRoles('ADMIN'), predictionsController.deleteTrendPoint);

export default router;