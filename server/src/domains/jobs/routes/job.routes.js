import { Router } from 'express';
import { authenticateToken } from '../../../middlewares/auth.js';
import {
  handleGetJobs,
  handleGetApplications,
  handleCreateApplication,
  handleUpdateApplication,
  handleUpdateStage,
  handleDeleteApplication,
  handleGetStats
} from '../controller/jobs.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', handleGetJobs);
router.get('/applications', handleGetApplications);
router.post('/applications', handleCreateApplication);
router.put('/applications/:id', handleUpdateApplication);
router.patch('/applications/:id/stage', handleUpdateStage);
router.delete('/applications/:id', handleDeleteApplication);
router.get('/stats', handleGetStats);

export default router;
