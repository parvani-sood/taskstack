import express from 'express';
import { getProjects, createProject, getProjectById, updateProjectMembers } from '../controllers/projectController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { getTasksByProject } from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .get(protect, getProjectById);

router.route('/:id/members')
  .put(protect, admin, updateProjectMembers);

// Route to get tasks for a specific project
router.route('/:projectId/tasks')
  .get(protect, getTasksByProject);

export default router;
