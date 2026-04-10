import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
