import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.get('/project/:projectId', getTasksByProject);
router.post('/project/:projectId', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
